let items = document.querySelectorAll(".GridItem");
let type = document.querySelector("#type");
function unicodeToChar(text) {
  return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
    return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
  });
}
document.querySelector(".search-button").addEventListener("click", function () {
  let query = document.querySelector(".query").value;
  if (query.length > 0) {
    fetch(
      type.value === "series"
        ? `https://wecimaa.cfd/search/${query}/list/series/`
        : `https://wecimaa.cfd/AjaxCenter/Searching/${query}/`
    )
      .then((res) => res.text())
      .then((res) => {
        document.querySelector(".search-result").innerHTML = unicodeToChar(res)
          .replaceAll(/\\/gi, "")
          .replaceAll(/"}/gi, "")
          .replaceAll(/{"output":"/gi, "")
          .replaceAll(/data-lazy-style/gi, "style");
        document
          .querySelector(".search-result")
          .querySelectorAll("style")
          .forEach((e) => e.remove());
        items = document.querySelectorAll(".GridItem");
        items.forEach((e) => {
          let href = e.querySelector("a").href;
          e.querySelector("a").href = "";
          e.addEventListener("click", (e) => {
            e.preventDefault();
            document.querySelector(".result").innerHTML = "";
            document.querySelector(".modal").classList.remove("hide");
            if (type.value === "movie") {
              directLink(href);
              window.scrollTo(0, 0);
            } else {
              parseSeries(href);
              window.scrollTo(0, 0);
            }
          });
        });
      });
  } else {
    document.querySelector(".query").style.borderColor = "red";
  }
});
function directLink(href) {
  fetch(href)
    .then((res) => res.text())
    .then((res) => {
      let temp = document.createElement("div");
      temp.innerHTML = res;
      document.querySelector(".player iframe").style.height = "60vh";
      document.querySelector(".result").innerHTML = "";
      document.querySelector(".player iframe").src = "";
      document.querySelector(".player iframe").src = temp
        .querySelector(".Inner--WatchServersEmbed iframe")
        .getAttribute("data-lazy-src");
      document
        .querySelector(".result")
        .append(temp.querySelector(".List--Download--Wecima--Single"));
    });
}
function parseSeries(href) {
  fetch(href)
    .then((res) => res.text())
    .then((res) => {
      let temp = document.createElement("div");
      temp.innerHTML = res;
      document.querySelector(".player iframe").style.height = "0";
      if (temp.querySelector(".List--Seasons--Episodes")) {
        document.querySelector(".result").innerHTML = "";
        document
          .querySelector(".result")
          .append(temp.querySelector(".List--Seasons--Episodes"));
        let seasonLinks = document.querySelectorAll(
          ".List--Seasons--Episodes a"
        );
        seasonLinks.forEach((e) => {
          let href = e.href;
          e.href = "";
          e.addEventListener("click", (e) => {
            window.scrollTo(0, 0);
            e.preventDefault();
            fetch(href)
              .then((res) => res.text())
              .then((res) => {
                let temp = document.createElement("div");
                temp.innerHTML = res;
                document.querySelector(".result").innerHTML = "";
                document.querySelector(".player iframe").style.height = "0";
                document
                  .querySelector(".result")
                  .appendChild(
                    temp.querySelector(".Episodes--Seasons--Episodes")
                  );
                let episodesLinks = document.body.querySelectorAll(
                  ".Episodes--Seasons--Episodes a"
                );
                episodesLinks.forEach((e) => {
                  e.addEventListener("click", (e) => {
                    window.scrollTo(0, 0);
                    e.preventDefault();
                    console.log(e.currentTarget.href);
                    directLink(e.currentTarget.href);
                  });
                });
              });
          });
        });
      } else {
        document.querySelector(".result");
        document.querySelector(".player iframe").style.height = "0";
        document
          .querySelector(".result")
          .append(temp.querySelector(".Episodes--Seasons--Episodes"));
        let episodesLinks = document.querySelectorAll(
          ".Episodes--Seasons--Episodes"
        );
        episodesLinks.forEach((e) => {
          let href = e.querySelector("a").href;
          e.querySelector("a").href = "";
          e.addEventListener("click", (e) => {
            window.scrollTo(0, 0);
            e.preventDefault();
            directLink(href);
          });
        });
      }
    });
}
document.querySelector(".exit").addEventListener("click", () => {
  document.querySelector(".modal").classList.add("hide");
  document.querySelector(".player iframe").src = "";
});
document.querySelector(".query").onfocus = () => {
  document.querySelector(".query").style.borderColor = "initial";
};
