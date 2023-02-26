# The logic behind the functions in the hogwartz.js

## The logic behind the search function in **searchStudents()**

1. At the beginning of the script, a new variable allStudentsCopy is declared and initialized to an empty array.
   When the searchStudents function is called, it first checks if allStudentsCopy is empty or not.
2. If allStudentsCopy is empty, it means that this is the first search performed by the user. In this case, we make a copy of the original allStudents array by using the spread operator ([...allStudents]) and store it in allStudentsCopy.
3. If allStudentsCopy is not empty, it means that we have already made a copy of the original allStudents array. In this case, we don't need to make a new copy, we can simply filter allStudentsCopy based on the search term entered by the user.
4. After filtering, the buildList function is called with the filtered allStudents array, which updates the student list in the view.
   By doing this, we are able to preserve the original allStudents array and perform multiple searches on it without losing any data. We keep a copy of the original array in allStudentsCopy, so we can always filter that copy based on the search term entered by the user.

---
