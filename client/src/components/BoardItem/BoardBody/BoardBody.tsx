import React from 'react';
import {
  BoardBodyWrapper,
  BoardBodyContainer,
  BoardBodyButtonContainer,
  BoardBodyContentContainer,
  BoardBodyInfoContainer,
} from './BoardBodyStyles';
import likeButton from '../../../static/emptyHeart.svg';
// import alreadyLikeButton from '../../../static/filledHeart.svg';
import commentButton from '../../../static/commentBtn.svg';

interface BoardBodyProps {
  content: string;
  like: number;
  comment: number;
  createAt: string;
}

const BoardBody = (props: BoardBodyProps) => {
  const { content, like, comment, createAt } = props;

  const onClickCommentIcon = () => {
    /* 해당 게시글의 댓글 창으로 이동 */
  };

  const onClickHeartIcon = () => {
    /* 이 게시글에 대한 좋아요 요청 */
  };

  return (
    <BoardBodyWrapper>
      <BoardBodyContainer>
        <BoardBodyButtonContainer>
          <button type="button" onClick={onClickHeartIcon}>
            <img src={likeButton} alt="이 게시글이 마음에 듭니다." />
          </button>
          <button type="button" onClick={onClickCommentIcon}>
            <img
              src={commentButton}
              alt="이 게시글의 댓글을 확인하고 싶습니다."
            />
          </button>
        </BoardBodyButtonContainer>
        <BoardBodyContentContainer>
          <p>{content}</p>
        </BoardBodyContentContainer>
        <BoardBodyInfoContainer>
          <div>
            {like > 0 ? <p>좋아요 {like}개</p> : ''}
            {comment > 0 ? <p>댓글 {comment}개</p> : ''}
          </div>
          <p>{createAt}</p>
        </BoardBodyInfoContainer>
      </BoardBodyContainer>
    </BoardBodyWrapper>
  );
};

export default BoardBody;