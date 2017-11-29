/*
This is empty on purpose! Your code to build the resume will go here.
 */

var bio = {
 "name": "Coco Matthey",
 "role": "Software Engineer",
 "contacts": {
   "mobile": "upon request",
   "email": "cm_indeed-357@matthey.us",
   "github": "cmatthey",
   "location": "San Fracisco Bay Area",
   "linkedin": "https://www.linkedin.com/in/coco-matthey",
   "skype": "coco.matthey",
 },
 "welcomeMessage": "passionate to engneer the world a better place",
 "skills": ["Java", "Python", "Scala", "Android", "REST", "Relational database"],
 "biopic": "https://goo.gl/L9h1gW"
};

var projects = {
  "projects": [
    {
      "title": "Pantry Boss",
      "dates": "2017",
      "description": "Pantry Boss is a recipe matcher and pantry management " +
      "app. It helps users find recipes by ingredient/s. It matches " +
      "ingredients from a recipe and inventory from a user and only shows " +
      "recipes available to the users based on the ingredients the user has " +
      "in his/her pantry. It also tracks pantry inventory. Once a user " +
      "selects and confirms a recipe, the pantry inventory will be " +
      "automatically adjusted to reflect ingredient usage. A user can edit " +
      "the pantry inventory after the pantry has been restocked with new " +
      "ingredients.  This is a multi-user application. A user registers to " +
      "create an account, then logs in to use the application",
      "images": [
        "https://github.com/cmatthey/pantryboss/blob/master/img/recipe_small.png?raw=true",
        "https://github.com/cmatthey/pantryboss/blob/master/img/inventory_screen.png?raw=true"
      ]
    }
  ]
};
var work = {
  "jobs": [
    {
      "employer": "GlobalLogic",
      "title": "Software Engineer",
      "location": "Palo Alto, CA",
      "dates": "2017",
      "description": "Globally large scale cloud based services"
    }
  ]
};

var education = {
  "schools": [
    {
      "name": "Northwestern Polytechnic University",
      "location": "Fremont, CA",
      "degree": "MS",
      "major": ["Computer Science"],
      "dates": "1998-2000"
    }
  ],
  "onlineCourses": [
    {
      "title": "Computer Programming",
      "school": "UCSC extension",
      "dates": "2017",
      "url": "http://www.udacity.com"
    },
    {
      "title": "Front-end Web Development",
      "school": "Udacity",
      "dates": "2017",
      "url": "http://ucsc-extension.edu"
    }
  ]
};

bio.display = function() {
  var data = "%data%";
  // header
  var formattedName = HTMLheaderName.replace(data, bio.name);
  var formattedRole = HTMLheaderRole.replace(data, bio.role);
  var formattedImg = HTMLbioPic.replace(data, bio.biopic);
  var formattedWelcomeMsg = HTMLwelcomeMsg.replace(data, bio.welcomeMessage);
  $("#header").append(formattedWelcomeMsg);
  $("#header").prepend(formattedRole);
  $("#header").prepend(formattedName);
  $("#header").append(formattedImg);


  // skills
  if (bio.skills.length > 0) {
    $("#header").append(HTMLskillsStart);
    for (var i=0; i<bio.skills.length; i++) {
      $("#skills:last").append(HTMLskills.replace(data, bio.skills[i]));
    }
  }

  // contacts
  var formattedEmail = HTMLemail.replace(data, bio.contacts.email);
  var formattedGithub = HTMLgithub.replace(data, bio.contacts.github);
  var formattedLocation = HTMLlocation.replace(data, bio.contacts.location);
  var formattedSkype = HTMLcontactGeneric.replace("%contact%", "skype").replace(data, bio.contacts.skype);
  $("#topContacts").append(formattedEmail + formattedGithub + formattedSkype + formattedLocation);
  $("#footerContacts").append(formattedEmail);
};

bio.display();

work.display = function() {
  var data = "%data%";
  if (work.jobs.length > 0) {
    work.jobs.forEach(
      function(job) {
        $("#workExperience").append(HTMLworkStart);
        var formattedEmployer = HTMLworkEmployer.replace(data, job.employer);
        var formattedTitle = HTMLworkTitle.replace(data, job.title);
        var formattedDates = HTMLworkDates.replace(data, job.dates);
        var formattedLocation = HTMLworkLocation.replace(data, job.location);
        var formattedDescription = HTMLworkDescription.replace(data, job.description);
        $(".work-entry:last").append(formattedEmployer + formattedTitle + formattedDates + formattedLocation + formattedDescription);
      }
    );
  }
};

work.display();

projects.display = function() {
  var data = "%data%";
  projects.projects.forEach(
    function(project) {
      $("#projects").append(HTMLprojectStart);
      var formattedTitle = HTMLprojectTitle.replace(data, project.title);
      var formattedDates = HTMLprojectDates.replace(data, project.dates);
      var formattedDescription = HTMLprojectDescription.replace(data, project.description);
      var formattedImages = "";
      for (var i=0; i<project.images.length; i++) {
        formattedImages += HTMLprojectImage.replace(data, project.images[i]);
      }
      $(".project-entry:last").append(formattedTitle + formattedDates + formattedDescription + formattedImages);
    });
};

projects.display();

education.display = function() {
  var data = "%data%";
  if (education.schools.length > 0) {
    $("#education").append(HTMLschoolStart);
      education.schools.forEach(
        function(school) {
          var formattedSchoolName = HTMLschoolName.replace(data, school.name);
          var formattedSchoolDegree = HTMLschoolDegree.replace(data, school.degree);
          var formattedSchoolLocation = HTMLschoolLocation.replace(data, school.location);
          var formattedSchoolMajor = HTMLschoolMajor.replace(data, school.major[0]);
          $(".education-entry").append(formattedSchoolName + formattedSchoolDegree + formattedSchoolLocation + formattedSchoolMajor);
        }
      );
  }
  if (education.onlineCourses.length > 0) {
    $(".education-entry").append(HTMLonlineClasses);
    education.onlineCourses.forEach(
      function(online) {
        var formattedOnlineTitle = HTMLonlineTitle.replace(data, online.title);
        var formattedOnlineSchool = HTMLonlineSchool.replace(data, online.school);
        var formattedOnlineDate = HTMLonlineDates.replace(data, online.dates);
        var formattedOnlineURL = HTMLonlineURL.replace(data, online.url);
      $(".education-entry").append(formattedOnlineTitle + formattedOnlineSchool + formattedOnlineDate + formattedOnlineURL);
      }
    );
  }
};
education.display();

$("#main").append(internationalizeButton);

function locationizer(work_obj) {
  var locationArray = [];
  work_obj.jobs.forEach(
    function(job) {
      locationArray.push(job.location);
    }
  );
  return locationArray;
}

function inName(name) {
  var nameArray = name.trim().split(" ");
  var internationalizedName = "";
  if (nameArray.length > 1) {
    return nameArray.slice(0, nameArray.length - 1).join(" ") + " " + nameArray[nameArray.length - 1].toUpperCase();
  } else {
    return nameArray[0].toUpperCase();
  }
}

function enableMap() {
  $("#mapDiv").append(googleMap);
}
enableMap();
