import React, { useState, useRef, useEffect } from "react";
import Comment from "./Comment";
import localStorageContent from "../../../utils/localstorage";
import "./styles.scss";

function Comments({ comments, leadId }: any) {
  const [showComments, setShowComments] = useState<boolean>(false);
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const [notificationsCount, setNotificationCount] = useState<number>(0);
  const localStoreData = localStorageContent.getUserData();
  const chatContainerRef: any = useRef(null);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [showComments]);

  useEffect(() => {
    console.log("commentsData", commentsData);
    if (comments.length > 0 && leadId) {
      const filteredComments = comments.filter(
        (cmt: any) => Number(cmt.lead_id) === Number(leadId)
      );
      setCommentsData(filteredComments);

      const notificationCount: number = filteredComments.filter(
        (cmt: any) => cmt.commented_by !== localStoreData?.userId
      ).length;
      setNotificationCount(notificationCount);
    }
  }, [comments]);

  return (
    <div className="comments">
      <div className="comments__header">
        <span onClick={toggleComments}>
          <i>Notifications message ({notificationsCount})</i>
        </span>
      </div>

      <div className="comments__body" ref={chatContainerRef}>
        {commentsData.length > 0 ? (
          <>
            {commentsData.map((comment: any, i: number) => (
              <Comment
                commentData={comment}
                key={i}
                index={i}
                userId={localStoreData?.userId}
                leadId={leadId}
              />
            ))}
          </>
        ) : (
          <p className="comments__body--no-comments">No comments</p>
        )}
      </div>
    </div>
  );
}

export default Comments;
