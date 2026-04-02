// 🔥 FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyAYIuD7JGH0udpP3_W0VwRRGuuj3I9nAQQ",
  authDomain: "ai-task-manager-36b85.firebaseapp.com",
  projectId: "ai-task-manager-36b85",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();


// 🚀 AUTH STATE (GLOBAL — VERY IMPORTANT)
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("auth").style.display = "none";
    document.getElementById("app").style.display = "block";

    loadTasks();

    // Delay popup for smooth UI
    setTimeout(() => {
      Swal.fire({
        title: 'Welcome back 👋',
        text: 'Ready to be productive today?',
        icon: 'info',
        confirmButtonColor: '#00adb5'
      });
    }, 500);
  } else {
    document.getElementById("auth").style.display = "block";
    document.getElementById("app").style.display = "none";
  }
});


// ✅ SIGNUP
function signup() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, pass)
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Signup Successful 🎉',
        text: 'Welcome!',
        confirmButtonColor: '#00adb5'
      });
    })
    .catch(err => {
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed ❌',
        text: err.message
      });
    });
}


// ✅ LOGIN
function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, pass)
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Login Successful ✅',
        text: 'Welcome back!',
        confirmButtonColor: '#00adb5'
      });
    })
    .catch(err => {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed ❌',
        text: err.message
      });
    });
}


// ✅ ADD TASK
function addTask() {
  const text = document.getElementById("taskInput").value;
  const priority = document.getElementById("priority").value;

  if (text === "") {
    Swal.fire("Enter a task!");
    return;
  }

  db.collection("tasks").add({
    text: text,
    priority: priority,
    created: Date.now()
  })
  .then(() => {
    document.getElementById("taskInput").value = "";

    Swal.fire({
      icon: 'success',
      title: 'Task Added 📝',
      timer: 1200,
      showConfirmButton: false
    });
  });
}


// ✅ LOAD TASKS
function loadTasks() {
  db.collection("tasks")
    .onSnapshot(snapshot => {

      const list = document.getElementById("taskList");
      list.innerHTML = "";

      let count = 0;

      snapshot.forEach(doc => {
        count++;

        const task = doc.data();
        const li = document.createElement("li");

        li.innerHTML = `
          ${task.text} (${task.priority})
          <button onclick="deleteTask('${doc.id}')">❌</button>
        `;

        list.appendChild(li);
      });

      // SweetAlert instead of custom popup
      if (count > 0) {
        Swal.fire({
          title: `You have ${count} tasks 📋`,
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
}


// ✅ DELETE TASK
function deleteTask(id) {
  Swal.fire({
    title: 'Are you sure?',
    text: "This task will be deleted!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#00adb5',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      db.collection("tasks").doc(id).delete();

      Swal.fire('Deleted!', 'Task removed.', 'success');
    }
  });
}


// ✅ AI SUGGESTION
function suggestTask() {
  const hour = new Date().getHours();

  let suggestion = "";

  if (hour < 12) {
    suggestion = "Start with your hardest task 💪";
  } else if (hour < 18) {
    suggestion = "Continue pending work 🚀";
  } else {
    suggestion = "Plan tomorrow’s tasks 📅";
  }

  document.getElementById("taskInput").value = suggestion;
}


// ✅ LOGOUT
function logout() {
  auth.signOut().then(() => location.reload());
}