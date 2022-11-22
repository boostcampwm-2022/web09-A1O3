import { Injectable, ConflictException } from '@nestjs/common';
import { Request } from 'express';
import { HttpService } from '@nestjs/axios';
import { redisClient } from 'src/utils/redis';
import { OauthInfo } from './model/oauth-info.enum';
import { RegisterUserDto } from './dto/user-register.dto';
import { OauthNaverDto } from './dto/oauth-naver.dto';
import { UserRepository } from 'src/user/user.repository';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly httpService: HttpService,
  ) {}

  // 홈페이지에서 로그인 확인 요청시 redis에서 세션 id 확인
  async validateLogin(request: Request) {
    const user = redisClient.get(request.sessionID);
    if (!user) return { code: 500, message: 'Unauthorized User' };
    else {
      return { code: 200, message: 'SUCCESS' };
    }
  }

  async register(registerUserDto: RegisterUserDto) {
    // TODO: OauthInfo 추가
    const { email, imageURL, userName } = registerUserDto;

    const find = await this.userRepository.findByOauthInfo(
      email,
      OauthInfo.NAVER,
    );

    if (find) {
      throw new ConflictException('이미 존재하는 유저입니다.');
    }

    const user = {
      name: userName,
      email: email,
      oauth_info: OauthInfo.NAVER,
      profile_url: imageURL,
    };
    this.userRepository.save(user);

    return { code: 200, message: 'Success' };
  }

  // // 로그인요청시 기존유저인지 검증 아니라면 회원가입 페이지로
  async login(email: string, request: Request) {
    const user = await this.userRepository.findByOauthInfo(
      email,
      OauthInfo.NAVER,
    );

    if (user) {
      await redisClient.set(request.sessionID, email);
      return {
        code: 200,
        userId: user.id,
        message: 'Success',
      };
    } else {
      return {
        code: 200,
        message: 'Register Required',
        redirect: true,
        email: email,
      };
    }
  }

  async logout(request: Request) {
    await redisClient.del(request.sessionID);
    request.session.destroy((err) => {
      if (err) {
        console.log(err);
        return { code: 500, message: 'Fail' };
      } else {
        return { code: 200, message: 'Success' };
      }
    });
  }

  async loginNaver(oauthNaverDto: OauthNaverDto, request: Request) {
    const { accessToken, tokenType } = await this.getNaverToken(oauthNaverDto);

    const email = await this.getUserEmail(accessToken, tokenType);

    return await this.login(email, request);
  }

  async getNaverToken(oauthNaverDto: OauthNaverDto): Promise<{
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
  }> {
    const { authorizationCode, state } = oauthNaverDto;
    const url =
      'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=' +
      process.env.NAVER_CLIENT_ID +
      '&client_secret=' +
      process.env.NAVER_CLIENT_SECRET +
      '&code=' +
      authorizationCode +
      '&state=' +
      state;

    const option = {
      method: 'post',
      url: url,
    };

    const response = this.httpService.request(option).pipe(map((r) => r.data));
    const data = await firstValueFrom(response);

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      tokenType: data.token_type,
      expiresIn: data.expires_in,
    };
  }

  async getUserEmail(accessToken: string, tokenType: string): Promise<string> {
    const userInfoRequestURL = `https://openapi.naver.com/v1/nid/me`;
    const option = {
      method: 'get',
      url: userInfoRequestURL,
      headers: {
        Authorization: `${tokenType} ${accessToken}`,
      },
    };
    const response = this.httpService.request(option).pipe(map((r) => r.data));
    const data = await firstValueFrom(response);

    return data.response.email;
  }
}