import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineFile } from "react-icons/ai";
import "../styles.scss";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { selectedReviewFile } from "../../../../store/actions/creators";
import localStorageContent from "../../../../utils/localstorage";
import { IInitialState } from "../../../../store/reducers/models";

function Comment({ commentData, userId, index, leadId }: any) {
  const {
    commented_by,
    comment,
    commented_name,
    attachment,
    url,
    status,
    comment_id,
    created_dt,
  } = commentData;
  const sender: boolean = commented_by === userId;
  const localUserData = localStorageContent.getUserData();
  const gloablStore = useSelector((state: any) => state.store);
  const { leadData }: IInitialState = gloablStore;
  const dispatch = useDispatch();

  const onSubmitSelectedFile = (e: any) => {
    dispatch(selectedReviewFile({ status: "1" }, leadId, e.target.value));
  };

  const extractTextFromHTML = (html: any) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText || "";
  };

  return (
    <div
      className={`comments__body--message ${
        sender ? "comments__body--mine" : "comments__body--recevier"
      }`}
    >
      <div className="comments__body--message__user">
        <FaUserCircle size={25} />
        <p>{sender ? "You" : `${commented_name}`}</p>
      </div>
      <div className="comments__body--message__comment">
        <p dangerouslySetInnerHTML={{ __html: extractTextFromHTML(comment) }} />
      </div>
      {attachment && (
        <div tabIndex={1} className="comments__body--message__attachment">
          <div className="comments__body--message__attachment--item">
            <AiOutlineFile />
            <p id="tax-file">
              File :{" "}
              <a href={attachment} target="_blank" rel="noopener noreferrer">
                {attachment.split("/").pop().replace(/%20/g, "") || "Tax file"}
              </a>
            </p>
          </div>
          {leadData && leadData?.lead_status === "4" ? (
            <div className="comments__body--message__attachment--item">
              <p>Select Your Tax Document </p>
              <input
                type="radio"
                value={comment_id}
                checked={status === "1"}
                onChange={onSubmitSelectedFile}
              />
              <p> {status === "1" && "Selected file"} </p>
            </div>
          ) : (
            <p> {status === "1" && "Selected file"} </p>
          )}
        </div>
      )}
      <div className="comments__body--message__time">
        <p>
          {new Date(created_dt).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true, // Use `false` for 24-hour format
            timeZone: "UTC", // Adjust this if you want to use a specific time zone
          })}
        </p>
      </div>
    </div>
  );
}

export default Comment;
