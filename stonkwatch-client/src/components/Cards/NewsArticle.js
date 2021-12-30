import React from "react";
import { format, parseISO } from "date-fns";

//Functional Component implemented for a news article segment
function NewsArticle({
  title,
  description,
  url,
  image,
  border,
  publishedDate
}) {
  let isImageProvided = image != null ? true : false;
  let style = border ? "article-border" : "article";

  return (
    <div className={style}>
      {isImageProvided ? (
        <div className="x">
          {image != null ? (
            <img src={image} className="newsImages"></img>
          ) : (
            <h1>IMG</h1>
          )}
        </div>
      ) : null}
      <div className="y">
        <div className="articleHeader">
          <h4>
            <a href={url}>
              <b>{title != null ? title : "Sample title"}</b>
            </a>
          </h4>
          <h8>
            {publishedDate
              ? "Published on: " +
                format(parseISO(publishedDate), "d MMM, yyyy")
              : null}
          </h8>
        </div>
        <p align="justify">
          {description != null ? description : "Sample description"}
        </p>
      </div>
    </div>
  );
}

export default NewsArticle;
