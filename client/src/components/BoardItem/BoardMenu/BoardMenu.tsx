import React, { useEffect, useRef } from 'react';
import { deleteBoardData } from '../../../apis/api/BoardApi';
import BoardMenuModal from './BoardMenuStyles';

interface BoardMenuProps {
  boardId: string;
  userId: number;
  changeHideOption: () => void;
}

const BoardMenu = (props: BoardMenuProps) => {
  const { boardId, userId, changeHideOption } = props;
  const modalRef = useRef<HTMLDivElement>(null);

  const deleteBoard = () => {
    /* 해당 게시글 삭제 요청 */
    try {
      deleteBoardData(boardId, userId);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };
  const modifyBoard = () => {
    /* 해당 게시글 수정 페이지로 이동 */
  };

  useEffect(() => {
    const clickOutOfModal = (event: MouseEvent) => {
      /* mousedown 이벤트가 발생한 영역이 모달창이 아닐 때, 모달창 제거 처리 */
      if (
        event.currentTarget !== null &&
        modalRef.current &&
        !modalRef.current?.contains(event.target as Node)
      ) {
        event.stopPropagation();
        changeHideOption();
      }
    };

    document.addEventListener('mousedown', clickOutOfModal);

    return () => {
      document.removeEventListener('mousedown', clickOutOfModal);
    };
  });

  return (
    <BoardMenuModal ref={modalRef}>
      <button type="button" onClick={modifyBoard}>
        수정하기
      </button>
      <button type="button" onClick={deleteBoard}>
        삭제하기
      </button>
      <button type="button" className="last-content" onClick={changeHideOption}>
        취소
      </button>
    </BoardMenuModal>
  );
};

export default BoardMenu;