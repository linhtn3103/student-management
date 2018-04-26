var router = require("express").Router();
var sequelize = require("../config/db/sequelize");

function findAcademicYear(callback) {
  sequelize.query("CALL`findAcademicYear`();").then(result => {
    result = JSON.parse(JSON.stringify(result));
    let year = [];
    let final = [];
    result.forEach(item => {
      item.academicYear = new Date(item.academicYear).getFullYear();
      if (!final.includes(item.academicYear)) {
        final.push(item.academicYear);
        year.push({
          academicYear: item.academicYear,
        })
      }
    });

    for (let i = 0; i < year.length; i++) {
      year[i]['detail'] = [];
      for (let j = 0 ; j < result.length; j++) {
        if (year[i]['academicYear'] == result[j]['academicYear']) {
          year[i]['detail'].push({
            id: result[j]['academicYearID'],
            semester: result[j]['semester'],
          })
        }
        if (year.length - i == 1 && result.length - j == 1) {
          callback(JSON.parse(JSON.stringify(year)));
        }
      }
    }
  });
}

router.get("/", function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render("class/index");
  } else {
    res.redirect("/login");
  }
});

router.get("/:level", function(req, res, next) {
  if (req.isAuthenticated()) {
    findAcademicYear(academicYear => {
      res.render("class/level", {
        khoi: req.params.level,
        academicYear: academicYear,
        hasListOfClass: false,
      });
    });
  } else {
    res.redirect("/login");
  }
});

router.get("/:level/:academicYear", function(req, res, next) {
  if (!req.isAuthenticated()) {
    sequelize.query("CALL `showClassOfAcademic`(:academicYear, :levelClass)", {
      replacements: {
        academicYear: req.params.academicYear,
        levelClass: req.params.level,
      }
    }).then(listOfClass => {
      listOfClass = JSON.parse(JSON.stringify(listOfClass));
      console.log(listOfClass)
      findAcademicYear(academicYear => {
        res.render("class/level", {
          khoi: req.params.level,
          academicYear: academicYear,
          listOfClass: listOfClass,
          hasListOfClass: true,
        });
      });
    })
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
