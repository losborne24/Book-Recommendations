window.onload = function() {
  document.getElementById("btn-register").onclick = function() {
    newUser();
  };
  document.getElementById("btn-login").onclick = function() {
    login();
  };
  document.getElementById("btn-submit").onclick = function() {
    addBookRating(
      document.getElementById("txt-book-name").value,
      document.getElementById("txt-rating").value
    );
  };
  document.getElementById("btn-edit").onclick = function() {
    addEditedRating(
      document.getElementById("edit-message").textContent,
      document.getElementById("input-rating").value
    );
  };
  document.getElementById("logout-tab").onclick = function() {
    logout();
    ratingsTab();
  };

  document.getElementById("delete-account-tab").onclick = function() {
    popUp(
      "Are you sure that you want to delete your account?",
      "pop-up-delete-account"
    );
    ratingsTab();
  };
  document.getElementById("btn-delete-account").onclick = function() {
    deleteAccount();
  };
  document.getElementById("btn-new").onclick = function() {
    document.getElementById("pop-up-container").style.visibility = "hidden";
    document.getElementById("pop-up-new-ratings").style.visibility = "hidden";
  };

  document.getElementById("login-tab").onclick = function() {
    document.getElementById("register-tab").style.cursor = "pointer";
    document.getElementById("login-tab").style.cursor = "default";
    document.getElementById("register-contents").style.left = "600px";
    document.getElementById("login-contents").style.left = "0px";
  };
  document.getElementById("register-tab").onclick = function() {
    document.getElementById("login-tab").style.cursor = "pointer";
    document.getElementById("register-tab").style.cursor = "default";
    document.getElementById("register-contents").style.left = "0px";
    document.getElementById("login-contents").style.left = "-600px";
  };

  document.getElementById("ratings-tab").onclick = function() {
    ratingsTab();
  };
  document.getElementById("recommendations-tab").onclick = function() {
    document.getElementById("ratings-tab").style.cursor = "pointer";
    document.getElementById("ratings-tab").classList.remove("avoid-clicks");
    document.getElementById("recommendations-tab").style.cursor = "default";
    document
      .getElementById("recommendations-tab")
      .classList.add("avoid-clicks");
    document.getElementById("recommendations-contents").style.left = "0px";
    document.getElementById("ratings-contents").style.left = "-600px";

    getRecommendations();
  };
};
function ratingsTab() {
  document.getElementById("recommendations-tab").style.cursor = "pointer";
  document
    .getElementById("recommendations-tab")
    .classList.remove("avoid-clicks");
  document.getElementById("ratings-tab").style.cursor = "default";
  document.getElementById("ratings-tab").classList.add("avoid-clicks");
  document.getElementById("recommendations-contents").style.left = "600px";
  document.getElementById("ratings-contents").style.left = "0px";
  removeChildren(document.getElementById("recommendations-tail"));
}
function newUser() {
  $.get("register", function(user) {
    document.getElementById("new-id").textContent = "New User ID: " + user;
    document.getElementById("login-information").style.visibility = "visible";
    document.getElementById("register-information").style.visibility = "hidden";
  });
}
function login() {
  $.post(
    "login",
    JSON.stringify(document.getElementById("input-user").value),
    function(data) {
      if (data == "null") {
        document.getElementById("register-information").style.visibility =
          "visible";
      } else {
        container = document.getElementById("ratings-tail");
        createRatingsGrid(data, container);

        document.getElementById("register-information").style.visibility =
          "hidden";
        document.getElementById("container-authentication").style.visibility =
          "hidden";
        document.getElementById("container-logged-in").style.visibility =
          "visible";
        document.getElementById("container-logged-in").style.height = "600px";
        //document.getElementById("test").textContent = data;
      }
    }
  );
}
function logout() {
  removeChildren(document.getElementById("ratings-tail"));
  removeChildren(document.getElementById("recommendations-tail"));
  document.getElementById("register-information").style.visibility = "hidden";
  document.getElementById("container-authentication").style.visibility =
    "visible";
  document.getElementById("container-logged-in").style.visibility = "hidden";
}
function createRatingsGrid(data, container) {
  var count = 0;
  data.forEach(item => {
    // var div = $('<div/>').text("Sup, y'all?").appendTo(container);
    //    $('<p/>').text(item[0]).appendTo(div);

    let cell1 = document.createElement("div");
    let cell2 = document.createElement("div");
    let cell3 = document.createElement("div");
    let cell4 = document.createElement("div");

    let contents1 = document.createElement("p");
    let contents2 = document.createElement("p");
    let contents3 = document.createElement("button");
    let contents4 = document.createElement("button");

    container.appendChild(cell1).className = "item book-name";
    contents1.textContent = item[0];
    cell1.appendChild(contents1);

    container.appendChild(cell2).className = "item";
    contents2.textContent = item[1];
    cell2.appendChild(contents2);

    container.appendChild(cell3).className = "item";
    contents3.textContent = "Edit";
    contents3.id = "edit-" + count.toString();
    contents3.classList.add("btn-edit");
    contents3.onclick = function() {
      editRating(this.id);
    };
    cell3.appendChild(contents3);

    container.appendChild(cell4).className = "item";
    contents4.textContent = "Delete";
    contents4.id = "delete-" + count.toString();
    contents4.classList.add("btn-delete");
    contents4.onclick = function() {
      deleteRating(this.id);
    };
    cell4.appendChild(contents4);

    count++;
  });
}

function addBookRating(book, rating) {
  rating = parseInt(rating, 10);
  if (book == "" || book == NaN) {
    popUp(
      "No book entered. Please enter a valid book name.",
      "pop-up-new-ratings"
    );
  } else if (isNaN(rating)) {
    popUp(
      "Please enter an integer rating between 0 and 5.",
      "pop-up-new-ratings"
    );
  } else if (rating > 5 || rating < 0) {
    popUp(
      "Please enter an integer rating between 0 and 5.",
      "pop-up-new-ratings"
    );
  } else {
    $.post("addBooks", JSON.stringify([book, rating]), function(data) {
      if (!Array.isArray(data)) {
        popUp(data, "pop-up-new-ratings");
      } else {
        removeChildren(document.getElementById("ratings-tail"));
        createRatingsGrid(data[0], document.getElementById("ratings-tail"));
        popUp(data[1], "pop-up-new-ratings");
      }
    });
  }
}
function addEditedRating(book, rating) {
  rating = parseInt(rating, 10);
  if (isNaN(rating)) {
    popUp(
      "Please enter an integer rating between 0 and 5.",
      "pop-up-new-ratings"
    );
  } else if (rating > 5 || rating < 0) {
    popUp(
      "Please enter an integer rating between 0 and 5.",
      "pop-up-new-ratings"
    );
  } else {
    $.post("editRating", JSON.stringify([book, rating]), function(data) {
      removeChildren(document.getElementById("ratings-tail"));
      createRatingsGrid(data[0], document.getElementById("ratings-tail"));
      popUp(data[1], "pop-up-new-ratings");
    });
  }
}

function deleteRating(bookID) {
  var position = parseInt(bookID.substring(7, bookID.length), 10);
  var bookList = document.getElementsByClassName("book-name");
  var bookName = bookList[position].firstChild.textContent;
  $.post("deleteRating", JSON.stringify(bookName), function(data) {
    removeChildren(document.getElementById("ratings-tail"));
    createRatingsGrid(data[0], document.getElementById("ratings-tail"));
    popUp(data[1], "pop-up-new-ratings");
  });
}

function editRating(editID) {
  var position = parseInt(editID.substring(5, editID.length), 10);
  var bookList = document.getElementsByClassName("book-name");
  var bookName = bookList[position].firstChild.textContent;
  popUp(bookName, "pop-up-edit-ratings");
}
function deleteAccount() {
  $.get("deleteAccount", function() {
    document.getElementById("pop-up-delete-account").style.visibility =
      "hidden";
    logout();
  });
}
function getRecommendations() {
  container = document.getElementById("recommendations-tail");
  $.get("getRecommendations", function(data) {
    if (data == "null") {
      popUp(
        "You must make a book rating before recieving book recommendations",
        "pop-up-new-ratings"
      );
      ratingsTab();
    } else {
      var array = JSON.parse("[" + data + "]");

      array[0].forEach(item => {
        let cell1 = document.createElement("div");
        let cell2 = document.createElement("div");
        let cell3 = document.createElement("div");

        let contents1 = document.createElement("p");
        let contents2 = document.createElement("p");
        let contents3 = document.createElement("p");

        container.appendChild(cell1).className = "recommended-item";
        contents1.textContent = item[0];
        cell1.appendChild(contents1);

        container.appendChild(cell2).className = "recommended-item";
        contents2.textContent = item[1];
        cell2.appendChild(contents2);

        container.appendChild(cell3).className = "recommended-item";
        contents3.textContent = item[2];
        cell3.appendChild(contents3);
      });
    }
  });
}

function popUpClose() {
  document.getElementById("pop-up-container").style.visibility = "hidden";
  document.getElementById("pop-up-new-ratings").style.visibility = "hidden";
  document.getElementById("pop-up-edit-ratings").style.visibility = "hidden";
  document.getElementById("pop-up-delete-account").style.visibility = "hidden";
}
function popUp(content, containerID) {
  document.getElementById("pop-up-container").style.visibility = "visible";
  if (containerID == "pop-up-new-ratings") {
    document.getElementById(containerID).style.visibility = "visible";
    document.getElementById("pop-up-edit-ratings").style.visibility = "hidden";
    document.getElementById("pop-up-delete-account").style.visibility =
      "hidden";
    document.getElementById("new-message").textContent = content;
  } else if (containerID == "pop-up-edit-ratings") {
    document.getElementById(containerID).style.visibility = "visible";
    document.getElementById("pop-up-new-ratings").style.visibility = "hidden";
    document.getElementById("pop-up-delete-account").style.visibility =
      "hidden";
    document.getElementById("edit-message").textContent = content;
  } else if (containerID == "pop-up-delete-account") {
    document.getElementById(containerID).style.visibility = "visible";
    document.getElementById("pop-up-new-ratings").style.visibility = "hidden";
    document.getElementById("pop-up-edit-ratings").style.visibility = "hidden";
    document.getElementById("delete-message").textContent = content;
  }
}
function removeChildren(parent) {
  while (parent.firstChild) {
    parent.firstChild.remove();
  }
}
