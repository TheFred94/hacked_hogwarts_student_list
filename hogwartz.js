"use strict";

const studentDataUrl = "https://petlatkea.dk/2021/hogwarts/students.json";
const bloodStatusUrl = "https://petlatkea.dk/2021/hogwarts/families.json";
let allStudents = [];
let expelledStudents = [];
let allStudentsCopy = [];
let studentBloodStatus = [];
let pureBloods = [];
let halfBloods = [];
let students;
let studentCard;
let allStudentsCounter = 0;
let expelledStudentsCounter = 0;
let displayedStudentsCounter = 0;
let isHacked = false;
const allStudentsCounterElement = document.querySelector("#allStudentsCounter");
const expelledStudentsCounterElement = document.querySelector("#expelledStudentsCounter");
const displayedStudentsCounterElement = document.querySelector("#displayedStudentsCounter");
const hackTheSystemBody = document.querySelector("body");
const burgerBtn = document.getElementById("burger-btn");
const burgerMenu = document.getElementById("burger-menu");
const filterButtons = document.querySelectorAll(".filter");
const sortingBtn = document.getElementById("sorting-btn");
const sortingMenu = document.getElementById("sorting");
const sortingButtons = document.querySelectorAll(".sorting");
const closeSorting = document.getElementById("close_sorting");
const closeFiltering = document.getElementById("close_filtering");
const hackTheSystemBtn = document.getElementById("hackTheSystem");

const houseColors = {
  Gryffindor: "gryffindor",
  Hufflepuff: "hufflepuff",
  Slytherin: "slytherin",
  Ravenclaw: "ravenclaw",
};

closeSorting.addEventListener("click", () => {
  closeSortingMenu();
});
closeFiltering.addEventListener("click", () => {
  closeBurgerMenu();
});

burgerBtn.addEventListener("click", () => {
  burgerMenu.classList.toggle("active");
  burgerBtn.classList.toggle("filter_active");

  closeSortingMenu();
});

function closeBurgerMenu() {
  burgerMenu.classList.remove("active");
  burgerBtn.classList.remove("filter_active");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", closeBurgerMenu);
});

function closeSortingMenu() {
  sortingMenu.classList.remove("active");
  sortingBtn.classList.remove("filter_active");
}

sortingBtn.addEventListener("click", () => {
  sortingMenu.classList.toggle("active");
  sortingBtn.classList.toggle("filter_active");

  closeBurgerMenu();
});

sortingButtons.forEach((button) => {
  button.addEventListener("click", closeSortingMenu);
});

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
  expelled: false,
  gender: "",
};

// Toggles between the lists of students and expelled students
function toggleStudents() {
  let allStudents = document.getElementById("allstudents");
  let expelledStudents = document.getElementById("expelledstudents");
  let toggleButton = document.getElementById("toggle_text");

  if (allStudents.style.display === "none") {
    allStudents.style.display = "block";
    expelledStudents.style.display = "none";
    toggleButton.textContent = "Show expelled students";
  } else {
    allStudents.style.display = "none";
    expelledStudents.style.display = "block";
    toggleButton.textContent = "Show all students";
  }
}
// Controls the filter functions
const filterFunctions = {
  gryffindor: (studentCard) => studentCard.house === "Gryffindor",
  hufflepuff: (studentCard) => studentCard.house === "Hufflepuff",
  ravenclaw: (studentCard) => studentCard.house === "Ravenclaw",
  slytherin: (studentCard) => studentCard.house === "Slytherin",
  prefect: (studentCard) => studentCard.prefect === true,
  iqsquad: (studentCard) => studentCard.iqSquad === true,
  pureblood: (studentCard) => studentCard.blood === "Pureblood",
  halfblood: (studentCard) => studentCard.blood === "Half-blood",
  muggleborn: (studentCard) => studentCard.blood === "Muggle-born",
};

// controls the sorting and filter settings
const settings = {
  filter: "all",
  sortBy: "name",
  sortDir: "desc",
};
// Loads the page
function loadPage() {
  console.log("Page loaded");
  registerButtons();

  // Fetch blood status data
  fetch(bloodStatusUrl)
    .then((response) => response.json())
    .then((data) => {
      // Process blood status data into two arrays
      pureBloods = data.pure;
      halfBloods = data.half;

      // Fetch and process student data and sorts students into either pure or halfblood students
      fetch(studentDataUrl)
        .then((response) => response.json())
        .then((data) => {
          // Process student data
          allStudents = data.map(prepareObject);
          allStudentsCopy = [...allStudents];
          buildList();

          // Filter students by blood status
          studentBloodStatus = allStudents.filter((student) => {
            const isPureBlood = pureBloods.includes(student.lastname);
            const isHalfBlood = halfBloods.includes(student.lastname);
            return isPureBlood || isHalfBlood;
          });
          console.log(
            "Purebloods:",
            studentBloodStatus.filter((student) => pureBloods.includes(student.lastname))
          );
          console.log(
            "Halfbloods:",
            studentBloodStatus.filter((student) => halfBloods.includes(student.lastname))
          );
        });
    });
}
// Gives eventlisteners on all the buttons
function registerButtons() {
  document.getElementById("search-button").addEventListener("click", searchStudents);
  document.getElementById("reset-button").addEventListener("click", resetStudents);
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
  document.querySelector("[data-action='hack']").addEventListener("click", checkUserReadyness);

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

function prepareObject(jsonObject) {
  const studentCard = Object.create(Student);

  let fullnameTrim = jsonObject.fullname.trim().split(" ");

  studentCard.firstname = getFirstname(fullnameTrim);
  studentCard.middlename = getMiddlename(fullnameTrim);
  studentCard.nickname = getNickname(fullnameTrim);
  studentCard.lastname = getLastname(fullnameTrim);
  studentCard.image = getStudentImage(fullnameTrim);
  studentCard.house = getStudentHouse(jsonObject);
  studentCard.gender = getStudentGender(jsonObject);

  const isPureBlood = pureBloods.includes(studentCard.lastname);
  const isHalfBlood = halfBloods.includes(studentCard.lastname);
  studentCard.blood = isPureBlood ? "Pureblood" : isHalfBlood ? "Half-blood" : "Muggle-born";

  return studentCard;
}
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

// Search function
function searchStudents() {
  // allStudentsCopy hold a copy of allStudents array.
  // Function checks if the copy is empty. If it is a copy is created
  // search is performed on allStudentsCopy.
  // Results are stored in the allStudents array.
  // ! Ensures that the allStudents array can be searched repeadetly. Every search the allStudents array is filtered and updated, while the allStudentsCopy array holds the copy
  // * See theLogicBehind.md for more details
  const searchTerm = document.getElementById("search-input").value.trim().toLowerCase();

  // if allStudentsCopy is empty, create a copy of allStudents array
  if (allStudentsCopy.length === 0) {
    allStudentsCopy = [...allStudents];
  }

  allStudents = allStudentsCopy.filter((student) => student.firstname.toLowerCase().includes(searchTerm));
  buildList();
  console.log(allStudents);
}

// Resets the list of students back to the allStudents array
function resetStudents() {
  document.getElementById("search-input").value = ""; // clear the search input field
  allStudents = [...allStudentsCopy]; // restore the original unfiltered array
  buildList();
}
// Build the list of students whenever the user filter or sorts. This is the center of the script
function buildList() {
  displayedStudentsCounter = 0;

  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);
  displayList(sortedList);

  updateCounters(currentList);
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

  // Grabs the firstname data field in the HTML and displays the textcontent from the studentCard firstname property
  clone.querySelector("[data-field=firstname]").textContent = studentCard.firstname;
  clone.querySelector("[data-field=nickname]").textContent = studentCard.nickname;
  clone.querySelector("[data-field=middlename]").textContent = studentCard.middlename;
  clone.querySelector("[data-field=lastname]").textContent = studentCard.lastname;
  clone.querySelector("#studentHouse").src = `house_crests/${studentCard.house}.svg`;
  clone.querySelector("[data-field=gender]").textContent = studentCard.gender;
  clone.querySelector("#studentImage").src = `images/${studentCard.image}`;
  clone.querySelector("#studentBlood").src = `blood_status/${studentCard.blood}.svg`;
  clone.querySelector(".image").addEventListener("click", () => showStudentDetails(studentCard));
  clone.querySelector(".gender").addEventListener("click", () => showStudentDetails(studentCard));
  clone.querySelector(".bloodtype").addEventListener("click", () => showStudentDetails(studentCard));
  clone.querySelector("#student_firstname").addEventListener("click", () => showStudentDetails(studentCard));
  clone.querySelector("#student_nickname").addEventListener("click", () => showStudentDetails(studentCard));
  clone.querySelector("#student_middlename").addEventListener("click", () => showStudentDetails(studentCard));
  clone.querySelector("#student_lastname").addEventListener("click", () => showStudentDetails(studentCard));
  clone.querySelector(".house_crest_container").addEventListener("click", () => showStudentDetails(studentCard));
  clone.querySelector(".student_template").classList.add(houseColors[studentCard.house]);
  clone.querySelector("[data-field=expelled]").addEventListener("click", function () {
    document.querySelector("#removestudent").classList.remove("hide");

    document.querySelector("#removestudent #yes").addEventListener("click", expelStudent);
    document.querySelector("#removestudent #no").addEventListener("click", closeDialog);
    document.querySelector("#expelled_student_name").textContent = `Do you wish to expel ${studentCard.firstname} ${studentCard.lastname}?`;

    // Find the index of the student in the allStudents array
    const index = allStudents.findIndex((student) => student.firstname === studentCard.firstname);

    // Remove the student from the allStudents array and add them to the expelledStudents array
    const expelledStudent = allStudents.splice(index, 1)[0];
    expelledStudents.push(expelledStudent);

    // Rebuild the list to update the displayed students
  });

  function closeDialog() {
    document.querySelector("#removestudent").classList.add("hide");
    document.querySelector("#cant_expel").classList.add("hide");
    document.querySelector("#removestudent #yes").removeEventListener("click", expelStudent);
    popup.style.display = "none";

    // Add event listener to close #cant_expel dialog
    document.querySelector("#cant_expel #okay").addEventListener("click", closeDialog);
  }

  function expelStudent() {
    closeDialog();
    popup.style.display = "none";

    if (isHacked) {
      document.querySelector("#cant_expel").classList.remove("hide");
      return;
    }

    studentCard.expelled = true;
    moveToExpelled(studentCard);
  }

  // Assign prefect
  clone.querySelector("[data-field=prefect]").dataset.prefect = studentCard.prefect;
  clone.querySelector("[data-field=prefect]").addEventListener("click", clickPrefect);
  // Expelled function. Looks at index and splices the student from allStudents then pushes it into expelledStudents.
  // Then runs moveToExpelled which clones the student into the new template
  // Throws a dialog box with a "yes" or "no" possibility

  clone.querySelector("[data-field=iqsquad]").addEventListener("click", clickIqSquad);

  if (studentCard.iqSquad === true) {
    clone.querySelector("[data-field=iqsquad]").textContent = "⭐";
  } else {
    clone.querySelector("[data-field=iqsquad]").textContent = "☆";
  }

  // Check wether the student is from Slytherin or not. If not it's a no-go getting into the Inqisitorial Squad
  function clickIqSquad() {
    console.log(`this is ${studentCard.house}`);
    if (checkStudentHouse(studentCard)) {
      if (studentCard.iqSquad === true) {
        studentCard.iqSquad = false;
        console.log(studentCard.iqSquad);
      } else {
        studentCard.iqSquad = true;
        console.log(studentCard.iqSquad);
        if (isHacked) {
          setTimeout(() => {
            studentCard.iqSquad = false;
            console.log(studentCard.iqSquad);
            buildList();
          }, 2000);
        }
      }
      buildList();
    } else {
      console.log("Only Slytherin students can be added or removed from the IQ squad.");
      notASlytherinStudent();
    }
  }
  function notASlytherinStudent() {
    document.querySelector("#onlyslytherin").classList.remove("hide");
    document.querySelector("#onlyslytherin .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#onlyslytherin .filter").addEventListener("click", closeDialog);

    function closeDialog() {
      document.querySelector("#onlyslytherin .closebutton").removeEventListener("click", closeDialog);
      document.querySelector("#onlyslytherin .filter").removeEventListener("click", closeDialog);
      document.querySelector("#onlyslytherin").classList.add("hide");
      popup.style.display = "none";
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

  function removePrefect(studentCard) {
    studentCard.prefect = false;
  }
}

function moveToExpelled(studentCard) {
  // Get the template for expelled students
  const template = document.querySelector("#expelledstudent");

  // Clone the template and fill in the fields with the expelled student's data
  const row = template.content.cloneNode(true).querySelector("section");
  row.querySelector("[data-field='image'] img").src = `images/${studentCard.image}`;
  row.querySelector("[data-field='gender']").textContent = studentCard.gender;
  row.querySelector("[data-field='iqsquad']").textContent = `N/A`;
  row.querySelector("[data-field='prefect']").textContent = `N/A`;
  row.querySelector("#studentBlood").src = `blood_status/${studentCard.blood}.svg`;
  row.querySelector("#studentHouse").src = `house_crests/${studentCard.house}.svg`;
  row.querySelector("[data-field='firstname']").textContent = studentCard.firstname;
  row.querySelector("[data-field='nickname']").textContent = studentCard.nickname;
  row.querySelector("[data-field='middlename']").textContent = studentCard.middlename;
  row.querySelector("[data-field='lastname']").textContent = studentCard.lastname;
  row.querySelector(".image").addEventListener("click", () => showStudentDetails(studentCard));
  row.querySelector(".gender").addEventListener("click", () => showStudentDetails(studentCard));
  row.querySelector(".bloodtype").addEventListener("click", () => showStudentDetails(studentCard));
  row.querySelector("#student_firstname").addEventListener("click", () => showStudentDetails(studentCard));
  row.querySelector("#student_nickname").addEventListener("click", () => showStudentDetails(studentCard));
  row.querySelector("#student_middlename").addEventListener("click", () => showStudentDetails(studentCard));
  row.querySelector("#student_lastname").addEventListener("click", () => showStudentDetails(studentCard));
  row.querySelector(".house_crest_container").addEventListener("click", () => showStudentDetails(studentCard));
  row.querySelector("[data-field=image]").addEventListener("click", () => showStudentDetails(studentCard));

  // Add the new row to the table
  const tbody = document.querySelector("#expelledlist tbody");
  tbody.appendChild(row);
  console.log(allStudents);
  console.log(expelledStudents);
  buildList();
}

// Displays the popup and the details about a student
function showStudentDetails(studentCard) {
  popup.style.display = "block";
  popup.querySelector(".student_name").textContent = `${studentCard.firstname}`;
  popup.querySelector(".student_gender").textContent = `${studentCard.gender}`;
  popup.querySelector(".student_nickname").textContent = `${studentCard.nickname}`;
  popup.querySelector(".student_middlename").textContent = `${studentCard.middlename}`;
  popup.querySelector(".student_lastname").textContent = `${studentCard.lastname}`;
  popup.querySelector(".student_image").src = `images/${studentCard.image}`;
  popup.querySelector(".student_house_popup").src = `house_crests/${studentCard.house}.svg`;
  popup.querySelector(".student_blood").src = `blood_status/${studentCard.blood}.svg`;

  const iqSquadElem = popup.querySelector("[data-field=iqsquad]");
  if (studentCard.iqSquad === true) {
    iqSquadElem.textContent = "⭐";
  } else {
    iqSquadElem.textContent = "☆";
  }

  const expelledElem = popup.querySelector(".expelled_popup");
  if (studentCard.expelled === true) {
    expelledElem.textContent = "This student has been Expelled";
  } else {
    expelledElem.textContent = "";
  }
}

// Looks for a click on the "X" in the popup showStudentDetails
document.querySelector(".close").addEventListener("click", () => (popup.style.display = "none"));

// updates the counters when
function updateCounters(currentList) {
  allStudentsCounter = allStudents.length;
  expelledStudentsCounter = expelledStudents.length;
  displayedStudentsCounter = currentList.length;

  allStudentsCounterElement.textContent = allStudentsCounter;
  expelledStudentsCounterElement.textContent = expelledStudentsCounter;
  displayedStudentsCounterElement.textContent = displayedStudentsCounter;
}

function checkUserReadyness() {
  document.querySelector("#user_ready").classList.remove("hide");
  document.querySelector("#user_ready #no").addEventListener("click", closeDialog);

  function closeDialog() {
    document.querySelector("#user_ready").classList.add("hide");
    document.querySelector("#user_ready #no").removeEventListener("click", closeDialog);
  }

  // buffer array to hold pressed keys
  var buffer = [];

  document.addEventListener("keydown", function (event) {
    // get the currently pressed key
    var key = event.key;

    // add the pressed key to the buffer array
    buffer.push(key);

    // check if the buffer contains the word "i swear"
    if (buffer.join("").includes("i swear")) {
      // execute your function here
      hackTheSystem();
      // reset the buffer array
      buffer = [];
    }
  });
}

function hackTheSystem() {
  isHacked = true;
  hackTheSystemBody.classList.remove("systemIsNormal");
  hackTheSystemBody.classList.add("systemIsHacked");
  const newStudent = prepareObject({
    fullname: "Frederik Rømer Larsen",
    house: "Gryffindor",
    gender: "male",
  });

  // add new student to array
  allStudents.push(newStudent);

  // scramble blood statuses
  allStudents.forEach((student) => {
    const bloodStatuses = ["Pureblood", "Half-blood", "Muggle-born"];
    const newBloodStatus = bloodStatuses[Math.floor(Math.random() * bloodStatuses.length)];
    student.blood = newBloodStatus;
  });
  function closeDialog() {
    document.querySelector("#user_ready").classList.add("hide");
    document.querySelector("#user_ready #no").removeEventListener("click", closeDialog);
  }

  buildList();
  closeDialog();
  console.log("System hacked! Blood statuses scrambled.");
}
