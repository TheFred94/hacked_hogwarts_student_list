"use strict";

const studentDataUrl = "https://petlatkea.dk/2021/hogwarts/students.json";
let allStudents = [];
let students;
let studentCard;

document.addEventListener("DOMContentLoaded", loadPage);
const Student = {
  firstname: "",
  middlename: "",
  lastname: "",
  nickname: "",
  image: "",
  blood: "",
  house: "",
  iqsquad: false,
  prefect: false,
  gender: "",
};

// Controls the filter functions
const filterFunctions = {
  gryffindor: (studentCard) => studentCard.house === "Gryffindor",
  hufflepuff: (studentCard) => studentCard.house === "Hufflepuff",
  ravenclaw: (studentCard) => studentCard.house === "Ravenclaw",
  slytherin: (studentCard) => studentCard.house === "Slytherin",
};

const settings = {
  filter: "all",
  sortBy: "name",
  sortDir: "desc",
};
// Loads the page
function loadPage() {
  console.log("Page loaded");
  registerButtons();

  loadJSON(studentDataUrl);
}

function registerButtons() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
  console.log("buttons ready");
}

// Runs the async function that fetches the data from the Json------------------------------
// Not sure if this is needed at all?
async function getData(studentDataUrl) {
  const result = await fetch(studentDataUrl);
  students = await result.json();
  prepareObjects(jsonData);
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
// function showListOfStudents() {
//   // * console.log(students);
//   prepareObjects(jsonData);
// }

function prepareObjects(jsonData) {
  allStudents = jsonData.map(prepareObject);

  buildList();
}

function prepareObject(jsonObject) {
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
  studentCard.gender = getStudentGender(jsonObject);

  return studentCard;
}

// This is where all the magic happens. All the different name values are returned here -------------------------

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(`User selected ${filter}`);

  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
}
function selectSort(event) {
  //   This line of code is using the dataset property of the event.target object to get the value of a data-sort attribute on the HTML element that triggered an event.
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;
  console.log(`user selected ${sortBy} - ${sortDir}`);

  // Find "old" sortBy element, and remove .sortBy class
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  oldElement.classList.remove("sortby");

  // Indicate active sort
  event.target.classList.add("sortby");

  // Toggles the direction from asc to desc or vice versa!
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  console.log(`user selected ${sortBy}`);
  //  Runs the filterList function with the filter variable as it's parameter
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

// Creates the filter list - on load all students are displayed. Every time the filter is clicked it returns filteredList and builds a new list with the selected students accordin to the filter selected by the user
function filterList(filteredList) {
  const filterFunction = filterFunctions[settings.filterBy];
  if (filterFunction) {
    console.log(settings.filterBy);
    filteredList = allStudents.filter(filterFunction);
  } else {
    console.log("All students");
    filteredList = allStudents;
  }
  return filteredList;
}

// Gets the firstname
function getFirstname(studentName) {
  return `${studentName[0].charAt(0).toUpperCase()}${studentName[0].slice(1).toLowerCase()}`;
}

// Gets the middlename
function getMiddlename(studentName) {
  if (studentName.length <= 2) {
    return ``;
  } else {
    if (studentName[1].includes(`"`) === true) {
      return ``;
    } else {
      return `${studentName[1].charAt(0).toUpperCase()}${studentName[1].slice(1).toLowerCase()}`;
    }
  }
}

// Gets the nickname
function getNickname(studentName) {
  if (studentName.length === 1) {
    return ``;
  } else if (studentName.length > 1) {
    if (studentName[1].includes(`"`) !== true) {
      return ``;
    } else {
      return `${studentName[1].substring(1, 2).toUpperCase()}${studentName[1].substring(2, studentName[1].lastIndexOf('"')).toLowerCase()}`;
    }
  }
}

// Gets the lastname
function getLastname(studentName) {
  if (studentName.length === 1) {
    return ``;
  } else {
    if (studentName[1].includes("-")) {
      let sepLastName = studentName[1].split("-");
      return `${sepLastName[0].charAt(0).toUpperCase()}${sepLastName[0].slice(1).toLowerCase()}-${sepLastName[1].charAt(0).toUpperCase()}${sepLastName[1].slice(1).toLowerCase()}`;
    } else {
      const trimName = studentName[studentName.length - 1];
      return `${trimName.charAt(0).toUpperCase()}${trimName.slice(1).toLowerCase()}`;
    }
  }
}

// Gets the student image
function getStudentImage(studentName) {
  let trimName = studentName[studentName.length - 1];
  if (studentName.length === 1) {
    return ``;
  } else if (studentName[1] === "Patil") {
    return `${trimName.toLowerCase()}_${studentName[0].toLowerCase()}.png`;
  } else {
    if (studentName[1].includes("-")) {
      let sepName = trimName.split("-");
      return `${sepName[sepName.length - 1].toLowerCase()}_${studentName[0].charAt(0).toLowerCase()}.png`;
    } else {
      //Last name fix
      return `${trimName.toLowerCase()}_${studentName[0].charAt(0).toLowerCase()}.png`;
    }
  }
}

// Gets the house
function getStudentHouse(person) {
  const houseTrim = person.house.trim();
  return `${houseTrim.charAt(0).toUpperCase()}${houseTrim.slice(1).toLowerCase()}`;
}
function getStudentGender(person) {
  const genderTrim = person.gender.trim();
  return `${genderTrim.charAt(0).toUpperCase()}${genderTrim.slice(1).toLowerCase()}`;
}

function sortList(sortedList) {
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    settings.direction = 1;
  }
  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    // console.log(`sortBy is ${sortBy}`);
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}

function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);
  displayList(sortedList);
  console.log("new list build");
}

// Clears the html and displays the list-----------------------------------
function displayList(allStudents) {
  // Grabs the id="list" and the tbody element from the HTML and empties the content
  document.querySelector("#list tbody").innerHTML = "";

  //  Runs the displayStudent functions for each of the data entries in the Json file
  allStudents.forEach(displayStudent);
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
  clone.querySelector("[data-field=gender]").textContent = studentCard.gender;
  clone.querySelector("#studentImage").src = `images/${studentCard.image}`;

  // Assign prefect
  clone.querySelector("[data-field=prefect]").dataset.prefect = studentCard.prefect;
  clone.querySelector("[data-field=prefect]").addEventListener("click", clickPrefect);

  if (studentCard.iqSquad === true) {
    clone.querySelector("[data-field=iqsquad]").textContent = "⭐";
  } else {
    clone.querySelector("[data-field=iqsquad]").textContent = "☆";
  }
  clone.querySelector("[data-field=iqsquad]").addEventListener("click", clickIqSquad);

  // Check wether the student is from Slytherin or not. If not it's a no-go getting into the Inqisitorial Squad
  function clickIqSquad() {
    console.log(`this is ${studentCard.house}`);
    if (checkStudentHouse(studentCard)) {
      if (studentCard.iqSquad === true) {
        studentCard.iqSquad = false;
      } else {
        studentCard.iqSquad = true;
      }
      buildList();
    } else {
      console.log("Only Slytherin students can be added or removed from the IQ squad.");
    }
  }

  function clickPrefect() {
    if (studentCard.prefect === true) {
      studentCard.prefect = false;
    } else {
      makeStudentAPrefect(studentCard);
    }
    buildList();
  }
  document.querySelector("#list tbody").appendChild(clone);
}

function checkStudentHouse(student) {
  console.log(student.house);
  return student.house === "Slytherin";
}
// Check the house and gender of the selected prefect and returns the value
function checkPrefectLimit(house, gender) {
  let prefectsFromHouse = allStudents.filter((student) => student.house === house && student.prefect);
  let prefectsFromGender = prefectsFromHouse.filter((student) => student.gender === gender);
  return prefectsFromHouse.length < 2 && prefectsFromGender.length < 1;
}

function makeStudentIqSquad(student) {
  if (checkStudentHouse(student)) {
    console.log("this is a slytherin Student");
  } else {
    console.log("This is not a slytherin student");
  }
}

// Makes the selected student a prefect
function makeStudentAPrefect(selectedStudent) {
  const prefects = allStudents.filter((studentCard) => studentCard.prefect);

  // const numberOfPrefects = prefects.length;
  const other = prefects.filter((studentCard) => studentCard.gender === selectedStudent.gender).shift();

  assignPrefect(selectedStudent);
  // Checks the limit for prefects in each house
  function assignPrefect(student) {
    if (checkPrefectLimit(student.house, student.gender, student.firstname, student.lastname)) {
      student.prefect = true;
      console.log(`${student.firstname} ${student.lastname} is now a prefect of ${student.house}`);
      // removePrefectAOrPrefectB(prefects[0], prefects[1]);
    } else {
      console.log(`Cannot assign prefect ${student.firstname} ${student.lastname} from ${student.house} ${student.gender} as the prefect limit has been reached`);
      // removePrefectAOrPrefectB(prefects[0], prefects[1]);
      removeOtherPrefect(other);
    }
  }
  function removeOtherPrefect(other) {
    // if ignore - do nothing

    // if remove other:
    document.querySelector("#remove_other").classList.remove("hide");
    document.querySelector("#remove_other .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#remove_other #removeother").addEventListener("click", clickRemoveOther);
    document.querySelector("#remove_other [data-field=otherprefect]").textContent = `${other.firstname} ${other.lastname} as prefect`;
    // removePrefect(other);
    // assignPrefect(selectedStudent);

    function closeDialog() {
      document.querySelector("#remove_other").classList.add("hide");
      document.querySelector("#remove_other .closebutton").removeEventListener("click", closeDialog);
      document.querySelector("#remove_other #removeother").removeEventListener("click", clickRemoveOther);
    }
    function clickRemoveOther() {
      removePrefect(other);
      assignPrefect(selectedStudent);
      buildList();
      closeDialog();
    }
    // Ask the user to remove or ignore the other
  }

  // function removePrefectAOrPrefectB(prefectA, prefectB) {
  //   document.querySelector("#remove_aorb").classList.remove("hide");
  //   document.querySelector("#remove_aorb .closebutton").addEventListener("click", closeDialog);
  //   document.querySelector("#remove_aorb #removea").addEventListener("click", clickRemoveA);
  //   document.querySelector("#remove_aorb #removeb").addEventListener("click", clickRemoveB);

  //   // Show names on buttons
  //   document.querySelector("#remove_aorb [data-field=winnerA]").textContent = winnerA.name;
  //   document.querySelector("#remove_aorb [data-field=winnerB]").textContent = winnerB.name;

  //   // if ignore - do nothing
  //   function closeDialog() {
  //     document.querySelector("#remove_aorb").classList.add("hide");
  //     document.querySelector("#remove_aorb .closebutton").removeEventListener("click", closeDialog);
  //     document.querySelector("#remove_aorb #removea").removeEventListener("click", clickRemoveA);
  //     document.querySelector("#remove_aorb #removeb").removeEventListener("click", clickRemoveB);
  //   }
  //   // if removeA
  //   function clickRemoveA() {
  //     removePrefect(prefectA);
  //     assignPrefect(selectedStudent);
  //     buildList();
  //     closeDialog();
  //   }

  //   // else - if removeB
  //   function clickRemoveB() {
  //     removePrefect(prefectB);
  //     assignPrefect(selectedStudent);
  //     buildList();
  //     closeDialog();
  //   }
  // }
  function removePrefect(studentCard) {
    studentCard.prefect = false;
  }
}
