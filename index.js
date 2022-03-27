if (!window.indexedDB) {
  alert(
    "Your browser doesn't support a stable version of IndexedDB. Your sessions will not be saved."
  );
}


// Static data for mocking/testing
const activities = [
  { id: "9ce5a853-239a-41bb-b0e7-4125ca03e6ef", name: "Barbell Rows" },
  { id: "f84e1b05-4ebe-42dc-94d8-656ad2f0c929", name: "Bench Press" },
  { id: "c2efd519-2a8d-4c72-982d-1e3a92772a9f", name: "Chinup" },
  { id: "9f20a50b-0985-4bb0-b2f8-a9f4d8712e21", name: "Chinup (Negative)" },
  { id: "d9f56484-af96-43f2-a57c-57444207bb39", name: "Deadlift" },
  { id: "ec42af9f-5f6c-4bdb-947c-4e46cbe94885", name: "Overhead Press" },
  { id: "57343520-f556-401b-a42a-4285addcebbb", name: "Squat" },
]

const sessions = [
  {
    id: "282f9cf5-dbef-4e4e-be87-978068c9c822",
    timestamp: "2022-03-23T20:30:00.000Z",
    completed_exercises: [
      {
        id: "8f611a87-93d3-462e-8b7d-7f1c88a7b89a",
        activity_id: "9ce5a853-239a-41bb-b0e7-4125ca03e6ef",
        sets: 3,
        reps: [5, 5, 10],
        weight: 85,
        notes: "",
      },
      {
        id: "3ff44daa-ba05-40a2-bc26-07c03d59eb57",
        activity_id: "f84e1b05-4ebe-42dc-94d8-656ad2f0c929",
        sets: 3,
        reps: [5, 5, 11],
        weight: 85,
        notes: "Form kinda favoring one arm.",
      },
      {
        id: "a9e61102-bdce-45d2-86dd-451e5cdd7b75",
        activity_id: "57343520-f556-401b-a42a-4285addcebbb",
        sets: 3,
        reps: [5, 5, 10],
        weight: 85,
        notes: "Really unsure of the form.",
      },
    ],
    session_notes: "Overall, I think I am tight in my back, hips, and butt.",
  },
  {
    id: "9a1d0a8f-d735-43a0-91c2-8af31e024472",
    timestamp: "2022-03-25T20:30:00.000Z",
    completed_exercises: [
      {
        id: "ceef9ea6-1b05-46a9-bc63-03f62f5165fc",
        activity_id: "c2efd519-2a8d-4c72-982d-1e3a92772a9f",
        sets: 2,
        reps: [4, 3],
        weight: 0,
        notes: "",
      },
      {
        id: "260a5917-7386-4ebd-abdb-8d7c6f2f40d1",
        activity_id: "9f20a50b-0985-4bb0-b2f8-a9f4d8712e21",
        sets: 2,
        reps: [2, 5],
        weight: 0,
        notes: "Sharp pain in right wrist.",
      },
      {
        id: "1b458459-ba12-4cca-80eb-ce2d124aa987",
        activity_id: "ec42af9f-5f6c-4bdb-947c-4e46cbe94885",
        sets: 3,
        reps: [5, 4, 5],
        weight: 65,
        notes: "Oh my god fuck this hurts my wrists",
      },
      {
        id: "235b51cb-4a56-4b0f-a132-211bbfa0fbe9",
        activity_id: "d9f56484-af96-43f2-a57c-57444207bb39",
        sets: 3,
        reps: [5, 5, 12],
        weight: 135,
        notes: "Felt fine",
      },
    ],
    session_notes: "",
  }
]

// This is what our customer data looks like.
const customerData = [
  { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@example.com" },
  { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@example.org" },
];

const dbName = "the_name";

var request = indexedDB.open(dbName, 3);

request.onerror = (event) => {
  // Handle errors.
  console.error("Some error happened, idk: " + event.target.error);
};

request.onupgradeneeded = (event) => {
  var db = event.target.result;

  db.onerror = (event) => {
    // Generic error handler for all errors targeted at this database's
    // requests!
    console.error("Database error: " + event.target.error);
  };

  const existingObjectStores = db.objectStoreNames;

  if (!existingObjectStores.contains("customers")) {
    var objectStore = db.createObjectStore("customers", { keyPath: "ssn" });
    objectStore.createIndex("name", "name", { unique: false });
    objectStore.createIndex("email", "email", { unique: true });

    objectStore.transaction.oncomplete = (event) => {
      var customerObjectStore = db
        .transaction("customers", "readwrite")
        .objectStore("customers");
      customerData.forEach(function (customer) {
        customerObjectStore.add(customer);
      });
    };
  }

  if (!existingObjectStores.contains("activities")) {
    var objectStore = db.createObjectStore("activities", { keyPath: "id" });
    objectStore.createIndex("name", "name", { unique: true });

    objectStore.transaction.oncomplete = (event) => {
      var activityObjectStore = db
        .transaction("activities", "readwrite")
        .objectStore("activities");
      activities.forEach(function (activity) {
        activityObjectStore.add(activity);
      });
    };
  }

  if (!existingObjectStores.contains("sessions")) {
    var objectStore = db.createObjectStore("sessions", { keyPath: "id" });

    objectStore.transaction.oncomplete = (event) => {
      var sessionObjectStore = db
        .transaction("sessions", "readwrite")
        .objectStore("sessions");
        sessions.forEach(function (session) {
          sessionObjectStore.add(session);
      });
    };
  }
};

let activitiesFromDB = [];
let sessionsFromDB = [];
request.onsuccess = (event) => {
  var db = event.target.result;

  var tx = db.transaction(["activities", "sessions"], "readonly");

  var activityObjectStore = tx.objectStore("activities");
  var activityCursorRequest = activityObjectStore.openCursor();
  activityCursorRequest.onsuccess = (event) => {
    var cursor = event.target.result;
    if (cursor) {
      activitiesFromDB.push(cursor.value);
      cursor.continue();
    }
  }

  var sessionObjectStore = tx.objectStore("sessions")
  var sessionCursorRequest = sessionObjectStore.openCursor();
  sessionCursorRequest.onsuccess = (event) => {
    var list = document.getElementById("list-of-previous-sessions");
    var cursor = event.target.result;
    if (cursor) {
      sessionsFromDB.push(cursor.value);

      var summary = document.createElement("summary");
      summary.innerText = cursor.value.timestamp;

      var listItem = document.createElement('details');
      
      listItem.innerText = cursor.value.activity_id;
      listItem.appendChild(summary);
      list.appendChild(listItem);

      cursor.continue();
    }
  }

  // var req = db
  //   .transaction("customers")
  //   .objectStore("customers")
  //   .openCursor();
  // req.onsuccess = (event) => {
  //   var list = document.getElementById("list-of-previous-sessions")
  //   var cursor = event.target.result;
  //   if(cursor) {
  //     var summary = document.createElement("summary");
  //     summary.innerText = cursor.value.name;

  //     var listItem = document.createElement('details');
      
  //     listItem.innerText = "Name: " + cursor.value.name + '\nSSN: ' + cursor.value.ssn + '\nAge: ' + cursor.value.age + '\ne-mail: ' + cursor.value.email;

  //     listItem.appendChild(summary);

  //     list.appendChild(listItem);

  //     cursor.continue();
  //   } else {
  //     console.log('Entries all displayed.');
  //   }
  // }
};
