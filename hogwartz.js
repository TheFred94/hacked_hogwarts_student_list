"use strict";

const studentDataUrl = "https://petlatkea.dk/2021/hogwarts/students.json";
const allStudents = [];
let students;

document.addEventListener("DOMContentLoaded", loadPage);

// Loads the page
function loadPage() {
  console.log("Page loaded");
  loadJSON(studentDataUrl);
}

// Runs the async function that fetches the data from the Json------------------------------
// Not sure if this is needed at all?
async function getData(studentDataUrl) {
  const result = await fetch(studentDataUrl);
  students = await result.json();
  showListOfStudents();
}

// Loads the Json and prepares the data for the following functions---------------------------
function loadJSON() {
  fetch(studentDataUrl)
    .then((response) => response.json())
    .then((jsonData) => {
      prepareObjects(jsonData);
    });
  // Shows the array with all the students in the console
  console.log(allStudents);
}

// Shows the list of students---------------------------------------------
function showListOfStudents() {
  // * console.log(students);
  prepareObjects(jsonData);
}

// This is where all the magic happens. All the different name values are returned here -------------------------
function prepareObjects(jsonData) {
  jsonData.forEach((jsonObject) => {
    const Student = {
      firstname: "",
      middlename: "",
      lastname: "",
      nickname: "",
      image: "",
      blood: "",
      house: "",
    };

    // Creates a const with the name student card that contains all the information from the Object
    const studentCard = Object.create(Student);

    // Trims the fullName string
    let fullnameTrim = jsonObject.fullname.trim().split(" ");

    studentCard.firstname = getFirstname(fullnameTrim);
    studentCard.middlename = getMiddlename(fullnameTrim);
    studentCard.nickname = getNickname(fullnameTrim);
    studentCard.lastname = getLastname(fullnameTrim);
    studentCard.image = getStudentImage(fullnameTrim);
    studentCard.house = getStudentHouse(jsonObject);
    allStudents.push(studentCard);
    // studentCard.house = getStudentHouse(jsonObject);
    // * console.log(fullName);
    // Splits the fullname string into parts
    console.log(studentCard.firstname);
    console.log(studentCard.middlename);
    console.log(studentCard.nickname);
    console.log(studentCard.lastname);
    console.log(studentCard.image);
    console.log(jsonObject.house);
  });

  displayList();
}

// Gets the firstname
function getFirstname(name) {
  return `${name[0].charAt(0).toUpperCase()}${name[0].slice(1).toLowerCase()}`;
}

// Gets the middlename
function getMiddlename(name) {
  if (name.length <= 2) {
    return ``;
  } else {
    if (name[1].includes(`"`) === true) {
      return ``;
    } else {
      return `${name[1].charAt(0).toUpperCase()}${name[1].slice(1).toLowerCase()}`;
    }
  }
}

// Gets the nickname
function getNickname(name) {
  if (name.length === 1) {
    return ``;
  } else if (name.length > 1) {
    if (name[1].includes(`"`) !== true) {
      return ``;
    } else {
      return `${name[1].substring(1, 2).toUpperCase()}${name[1].substring(2, name[1].lastIndexOf('"')).toLowerCase()}`;
    }
  }
}

// Gets the lastname
function getLastname(name) {
  if (name.length === 1) {
    return ``;
  } else {
    if (name[1].includes("-")) {
      let sepLastName = name[1].split("-");
      return `${sepLastName[0].charAt(0).toUpperCase()}${sepLastName[0].slice(1).toLowerCase()}-${sepLastName[1].charAt(0).toUpperCase()}${sepLastName[1].slice(1).toLowerCase()}`;
    } else {
      const trimName = name[name.length - 1];
      return `${trimName.charAt(0).toUpperCase()}${trimName.slice(1).toLowerCase()}`;
    }
  }
}

// Gets the student image
function getStudentImage(name) {
  let trimName = name[name.length - 1];
  if (name.length === 1) {
    return ``;
  } else if (name[1] === "Patil") {
    return `${trimName.toLowerCase()}_${name[0].toLowerCase()}.png`;
  } else {
    if (name[1].includes("-")) {
      let sepName = trimName.split("-");
      return `${sepName[sepName.length - 1].toLowerCase()}_${name[0].charAt(0).toLowerCase()}.png`;
    } else {
      //Last name fix
      return `${trimName.toLowerCase()}_${name[0].charAt(0).toLowerCase()}.png`;
    }
  }
}

// Gets the house
function getStudentHouse(person) {
  const houseTrim = person.house.trim();
  return `${houseTrim.charAt(0).toUpperCase()}${houseTrim.slice(1).toLowerCase()}`;
}

// Clears the html and displays the list-----------------------------------
function displayList() {
  // Grabs the id="list" and the tbody element from the HTML and empties the content
  document.querySelector("#list tbody").innerHTML = "";

  //  Runs the displayStudent functions for each of the data entries in the Json file
  allStudents.forEach(displayStudent);
  console.log("displayList");
}

// Creates the student card/row for each of the students
function displayStudent(studentCard) {
  // Clones the template for each of the students
  const clone = document.querySelector("template#student").content.cloneNode(true);

  // if (studentCard.firstname === "Leanne") {
  //   clone.querySelector("[data-field=fullname]").textContent = studentCard.firstname;
  // } else if (studentCard.middlename === `N/A` && studentCard.nickname === `N/A`) {
  //  clone.querySelector("[data-field=fullname]").textContent = `${studentCard.firstname} ${studentCard.lastname}`;
  // } else if (studentCard.middlename === `N/A` && studentCard.nickname !== `N/A`) {
  //   clone.querySelector("[data-field=fullname]").textContent = `${studentCard.firstname} "${studentCard.nickname}" ${studentCard.lastname}`;
  // } else {
  //   clone.querySelector("[data-field=fullname]").textContent = `${studentCard.firstname} ${studentCard.middlename} ${studentCard.lastname}`;
  // }

  // Grabs the firstname data field in the HTML and displays the textcontent from the studentCard firstname property
  clone.querySelector("[data-field=firstname]").textContent = studentCard.firstname;
  clone.querySelector("[data-field=nickname]").textContent = studentCard.nickname;
  clone.querySelector("[data-field=middlename]").textContent = studentCard.middlename;
  clone.querySelector("[data-field=lastname]").textContent = studentCard.lastname;
  clone.querySelector("[data-field=house]").textContent = studentCard.house;
  clone.querySelector("#studentImage").src = `images/${studentCard.image}`;

  document.querySelector("#list tbody").appendChild(clone);
}
