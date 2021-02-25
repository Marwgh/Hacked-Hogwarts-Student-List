"use strict";

window.addEventListener("DOMContentLoaded", init);

//Full array
let allStudents = [];
//remeber last version displayed  
let allStudentsFiltered = [];
//array that expeld 
let allStudentsExpeld = [];
let allPrefectsS = [] ;
let allPrefectsH = [] ;
let allPrefectsR = [] ;
let allPrefectsG = [] ;

const Student = {
    firstName: "",
    lastName: "",
    middleName: "unknown",
    nickName: "unknown",
    gender: "",
    house: "",
    prefect : "",
    expelled : "" ,
    bloodType : "",
    image: "unknown"
};

/*const modal = document.querySelector(".modal-background");

modal.addEventListener("click", () => {
  modal.classList.add("hide");
});
*/


function init() {
    console.log("init");
    loadJSON();
    document.querySelector("[data-filter=Slytherin]").addEventListener("click", slytherinButton);
    document.querySelector("[data-filter=Ravenclaw]").addEventListener("click", ravenclawButton);
    document.querySelector("[data-filter=Hufflepuff]").addEventListener("click", hufflepuffButton);
    document.querySelector("[data-filter=Gryffindor]").addEventListener("click", gryffindorButton);
    document.querySelector("[data-filter=bloodType]").addEventListener("click", bloodTypeButton);
    document.querySelector("[data-filter=prefect]").addEventListener("click", prefectButton);
    document.querySelector("[data-filter=expelled]").addEventListener("click", expelledButton);
    document.querySelector("[data-filter=all]").addEventListener("click", allButton);

}

function loadJSON() {
    console.log("loadJSON");
    fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then(r => r.json())
    .then (jsonData => {
        // loaded --> prepare objects
        prepareObjects(jsonData);
    });
}

function prepareObjects(jsonData) {
    console.log("prepareObjects");
    jsonData.forEach(jsonObject => {
        
        const student = Object.create(Student);

        const flSpace = jsonObject.fullname.trim();

        const firstSpace = flSpace.indexOf(" ");

        const lastSpace = flSpace.lastIndexOf(" ");

        //cleaning of the first name
        if (firstSpace == -1) {
            student.firstName = flSpace;
        } else {
            student.firstName = flSpace.substring(0,firstSpace);
        }
        student.firstName = student.firstName.substring(0,1).toUpperCase() + student.firstName.substring(1).toLowerCase();

        //cleaning of the lastName (-)
        if (lastSpace == -1) {
            student.lastName = "";
        } else {
            student.lastName = flSpace.substring(lastSpace+1);
        }
        const hyphen = student.lastName.indexOf("-");
        if (hyphen == -1) {
            student.lastName = student.lastName.substring(0,1).toUpperCase() + student.lastName.substring(1).toLowerCase();        
        } else {
            student.lastName = student.lastName.substring(0, 1).toUpperCase() + student.lastName.substring(1, hyphen+1).toLowerCase() + student.lastName.substring(hyphen+1, hyphen+2).toUpperCase() + student.lastName.substring(hyphen+2).toLowerCase();
        }

        //cleaning of the middleName
        student.middleName = flSpace.substring(firstSpace,lastSpace).trim();
    
        if (student.middleName.substring(0,1) == `"`) {
            student.nickName = student.middleName;
            student.middleName = "";
            student.nickName = student.nickName.split('"').join('');
            student.nickName = student.nickName.substring(0,1).toUpperCase() + student.nickName.substring(1).toLowerCase();
        } else {
            student.nickName = false;
            student.middleName = student.middleName.substring(0,1).toUpperCase() + student.middleName.substring(1).toLowerCase();
        }

        //cleaning of the gender
        student.gender = jsonObject.gender.trim();
        student.gender = student.gender.substring(0,1).toUpperCase() + student.gender.substring(1).toLowerCase();

        //cleaning of the house
        student.house = jsonObject.house.trim();
        student.house = student.house.substring(0,1).toUpperCase() + student.house.substring(1).toLowerCase();

        //get image
        if (student.lastName == false) {
            student.image = "hogwarts.png" ;
        } else if  (student.lastName === "Patil" ) {
            student.image = student.lastName.toLowerCase() + "_" + student.firstName.toLowerCase() + ".png";
        }else if (hyphen == -1) {
            student.image = student.lastName.toLowerCase() + "_" + student.firstName.substring(0,1).toLowerCase() + ".png";
        } else {
            student.image = student.lastName.substring(hyphen+1).toLowerCase() + `_${student.firstName.substring(0,1).toLowerCase()}` + `.png`;
        } 

        //set everybody to normal people
        student.expelled = false ;
        student.prefect = false ;
        
        //fecth the data => .then student.lastname in pure blood list => itys pure / 
        /*
    
        fetch("https://petlatkea.dk/2020/hogwarts/students.json")
        .then(r => r.json())
        .then (jsonData => {
        student.bloodType = checkBloodType(student, jsonData);
        // loaded --> prepare objects

        });
        function checkBloodType () {
            if (student.lastName is in pure) {
                return "pure"
            } else if (student.lastname is un half) {
                return "half"
            } else {
                return "muggle"
            }
        }
        */



        allStudents.unshift(student);
    });
    allStudentsFiltered = allStudents ;
    displayList();
}

function displayList() {
    console.log("displayList");
    // clear the list
    document.querySelector("#list tbody").innerHTML = "";
    // build a new list
    
    allStudents.forEach(displayStudent);
}

function displayStudent(student) {
    console.log("displayStudent");
    // create clone / aka cloning my template in html
    const clone = document.querySelector("template#student").content.cloneNode(true);
    
    // set clone data
    clone.querySelector("[data-field=firstName]").addEventListener("click", clickStudent );

    function clickStudent () {
        
        showModal(student);
        //buildList();
    }
    clone.querySelector("[data-field=firstName]").textContent = student.firstName;
    clone.querySelector("[data-field=lastName]").textContent = student.lastName;
    //clone.querySelector("[data-field=middleName]").textContent = student.middleName;
    //clone.querySelector("[data-field=nickName]").textContent = student.nickName;
    //clone.querySelector("[data-field=gender]").textContent = student.gender;
    clone.querySelector("[data-field=house]").textContent = student.house;
    
    
    document.querySelector("#list tbody").appendChild(clone);

    /*copy.querySelector("button").addEventListener("click", () => {
         console.log("click", dish);
         fetch(`https://kea-alt-del.dk/t5/api/product?id=${dish.id}`)
           .then((res) => res.json())
           .then(showDetails);
       });
    */
}

function showModal(student) {
    console.log("showModal");
    const modal = document.querySelector(".modalBackground");

    //FILL CONTENT
    modal.querySelector(".modalStudentName").textContent = student.firstName +" "+ student.middleName +" "+ student.lastName;

    //IF NO IMAGE PUT REPLACEMENT 
    if (student.image == undefined) {
        ("you have no inage");
    } else {
        modal.querySelector("img").src = `images/${student.image}`;
    }
    

    //CHECK NICKNAME
    if (student.nickName){
        modal.querySelector(".nickNametll").classList.remove("hide");
        modal.querySelector(".modalStudentNickName").classList.remove("hide");
        modal.querySelector(".modalStudentNickName").textContent = student.nickName;
    } 

   //FILL CONTENT
    modal.querySelector(".modalGender").textContent = student.gender;
    modal.querySelector(".modalHouse").textContent = student.house;
    modal.querySelector(".modalContent").classList.add(student.house);

    //IF PREFECT THEN DISPLAY IT
    if (student.prefect == true) {
        modal.querySelector(".prefectIndicator").classList.remove("prefectsNo"); 
    }
    
    modal.querySelector(".prefectIndicator").addEventListener("click", clickPrefects );
    function clickPrefects () {
        modal.querySelector(".prefectIndicator").removeEventListener("click", clickPrefects );

        if (student.house === "Slytherin") {
            PrefectorSlyth(student);
            

        } else if (student.house === "Ravenclaw") {
            console.log("I am Ravenclaw");
            PrefectorRaven(student);
            
            
        } else if (student.house === "Hufflepuff") {
            console.log("I am Hufflepuff");
            PrefectorHuffl(student);
        } else if (student.house === "Gryffindor") {
            console.log("I am Gryffindor");
            PrefectorGryff(student);
        }
        

    }
    
    //DISPLAY
    modal.classList.remove("hide");

    //IF EXPLLE SPELL USED
    modal.querySelector("button").addEventListener("click", Expelliarmus);
    function Expelliarmus () {
        modal.querySelector("button").removeEventListener("click", Expelliarmus);
        student.expelled = true ;
        allStudents = allStudents.filter(expeling) ;
        allStudentsFiltered = allStudentsFiltered.filter(expeling);
        allStudentsExpeld.unshift(student);
        console.log("this is the expeld students");
        console.log(allStudentsExpeld);
        displayListFiltered(allStudentsFiltered);
    }
    //IF CLOSEBUTT CLICK T
    document.querySelector("#closeModalButton").addEventListener("click", closeModal);
    function closeModal() {
        modal.querySelector(".nickNametll").classList.add("hide");
        modal.querySelector(".modalStudentNickName").classList.add("hide");
        document.querySelector(".modalBackground").classList.add("hide");
        modal.querySelector(".modalContent").classList.remove(student.house);
        modal.querySelector(".prefectIndicator").classList.add("prefectsNo");
        student = "" ;
    }

   
}

function PrefectorSlyth(student) {
    const modal = document.querySelector(".modalBackground");
    console.log("all prefects from sliv");
            console.log(allPrefectsS);
            
            let areUprefect = checkHouse(allPrefectsS);
            console.log(areUprefect);

            if  (student.prefect == true ) {
                console.log("this is the student you are working with");
                console.log(student);
                student.prefect = false ;
                allPrefectsS = allPrefectsS.filter(isPrefect);
                modal.querySelector(".prefectIndicator").classList.add("prefectsNo");

            } else if (areUprefect == true) {

                student.prefect = true ;
                console.log("this is the student you are working with");
                console.log(student);
                allPrefectsS.unshift(student);
                modal.querySelector(".prefectIndicator").classList.remove("prefectsNo");

            } else if (areUprefect == false) {
                alert ("you cant")
             
            }
        
}
function PrefectorRaven(student) {
    const modal = document.querySelector(".modalBackground");
    console.log("all prefects from raven");
    console.log(allPrefectsR);
          
            let areUprefect = checkHouse(allPrefectsR);
            console.log(areUprefect);
 
            if  (student.prefect == true ) {
                console.log("this is the student you are working with");
                console.log(student);
                student.prefect = false ;
                allPrefectsR = allPrefectsR.filter(isPrefect);
                modal.querySelector(".prefectIndicator").classList.add("prefectsNo");
                 

            } else if (areUprefect == true) {

                student.prefect = true ;
                console.log("this is the student you are working with");
                console.log(student);
                allPrefectsR.unshift(student);
                modal.querySelector(".prefectIndicator").classList.remove("prefectsNo");

            } else if (areUprefect == false) {
                alert ("you cant")
             
            }
            
        
}
function PrefectorHuffl(student) {
    const modal = document.querySelector(".modalBackground");
    console.log("all prefects from Huffl");
    console.log(allPrefectsH);
          
            let areUprefect = checkHouse(allPrefectsH);
            console.log(areUprefect);
 
            if  (student.prefect == true ) {
                console.log("this is the student you are working with");
                console.log(student);
                student.prefect = false ;
                allPrefectsH = allPrefectsH.filter(isPrefect);
                modal.querySelector(".prefectIndicator").classList.add("prefectsNo");
                 

            } else if (areUprefect == true) {

                student.prefect = true ;
                console.log("this is the student you are working with");
                console.log(student);
                allPrefectsH.unshift(student);
                modal.querySelector(".prefectIndicator").classList.remove("prefectsNo");

            } else if (areUprefect == false) {
                alert ("you cant")
             
            }
            
        
}
function PrefectorGryff(student) {
    const modal = document.querySelector(".modalBackground");
    console.log("all prefects from Gryf");
    console.log(allPrefectsG);
          
            let areUprefect = checkHouse(allPrefectsG);
            console.log(areUprefect);
 
            if  (student.prefect == true ) {
                console.log("this is the student you are working with");
                console.log(student);
                student.prefect = false ;
                allPrefectsG = allPrefectsG.filter(isPrefect);
                modal.querySelector(".prefectIndicator").classList.add("prefectsNo");
                 

            } else if (areUprefect == true) {

                student.prefect = true ;
                console.log("this is the student you are working with");
                console.log(student);
                allPrefectsG.unshift(student);
                modal.querySelector(".prefectIndicator").classList.remove("prefectsNo");

            } else if (areUprefect == false) {
                alert ("you cant")
             
            }
            
        
}


function checkHouse (theList) {
    console.log("im comming in there");

    if (theList.length == 0 ){
        console.log("im counting for 0 "  );
        return true
    } else if (theList.length == 1  ) {
        console.log("im counting  for 1"  );
        return true
    } else if (theList.length == 2 ) {
        return false
    } else {
        return false
        
    }

}

// buttons

//SORTING EVENT LISTNER
document.querySelector("[data-filter=firstNameSort]").addEventListener("click" , sortFirstName);
document.querySelector("[data-filter=lastNameSort]").addEventListener("click" , sortLastName);

function sortFirstName () {
    allStudentsFiltered.sort(compareFirstName);
    console.log(allStudentsFiltered);
    displayListFiltered(allStudentsFiltered);

}
function compareFirstName (a,b) {
    if ( a.firstName < b.firstName ) {
        return -1;
    } else {
        return 1 ; 
    }
} 

function sortLastName () {
    allStudentsFiltered.sort(compareLastName);
    console.log(allStudentsFiltered);
    displayListFiltered(allStudentsFiltered);

}
function compareLastName (a,b) {
    if ( a.lastName < b.lastName ) {
        return -1;
    } else {
        return 1 ; 
    }
} 

function isPrefect(student) {
    console.log("its around here");
    if (student.prefect == true) {
        return true;
    } else {
        return false;
    }
}

function expeling(student) {
    console.log("its around here");
    if (student.expelled == true) {
        return false;
    } else {
        return true;
    }
}

function displayListFiltered (filtered) {
    document.querySelector("#list tbody").innerHTML = "";
    // build a new list
    filtered.forEach(displayStudent);
}
function slytherinButton() {
    const onlySlytherin = allStudents.filter(isSlytherin);
    allStudentsFiltered = onlySlytherin ;
    displayListFiltered(onlySlytherin);
}

function isSlytherin(student) {
    if (student.house === "Slytherin") {
        return true;
    } else {
        return false;
    }
}

function ravenclawButton() {
    const onlyRavenclaw = allStudents.filter(isRavenclaw);
    allStudentsFiltered = onlyRavenclaw ;
    displayListFiltered(onlyRavenclaw);
}

function isRavenclaw(student) {
    if (student.house === "Ravenclaw") {
        return true;
    } else {
        return false;
    }
}
  
function hufflepuffButton() {
    const onlyHufflepuff = allStudents.filter(isHufflepuff);
    allStudentsFiltered = onlyHufflepuff ;
    displayListFiltered(onlyHufflepuff);
}

function isHufflepuff(student) {
    if (student.house === "Hufflepuff") {
        return true;
    } else {
        return false;
    }
}
   
function gryffindorButton() {
    const onlyGryffindor = allStudents.filter(isGryffindor);
    allStudentsFiltered = onlyGryffindor ;
    displayListFiltered(onlyGryffindor);
}

function isGryffindor(student) {
    if (student.house === "Gryffindor") {
        return true;
    } else {
        return false;
    }
}

function bloodTypeButton() {
    const onlyBloodType = allStudents.filter(isBloodType);
    displayList(onlyBloodType);
}

function isBloodType(student) {
    if (student.bloodType === "bloodType") {
        return true;
    } else {
        return false;
    }
}

function prefectButton() {
    const onlyPrefect = allStudents.filter(isItPrefect);
    displayList(onlyPrefect);
}

function isItPrefect(student) {
    if (student.prefect === "prefect") {
        return true;
    } else {
        return false;
    }
}

function expelledButton() {
    const onlyExpelled = allStudentsExpeld.filter(isExpelled) ;
    allStudentsFiltered = onlyExpelled ;
    displayListFiltered(onlyExpelled);
}

function isExpelled(student) {
    if (student.expelled == true ) {
        return true;
    } else {
        return false;
    }
}

function allButton() {
    const onlyAll = allStudents;
    allStudentsFiltered = onlyAll ;
    displayListFiltered(onlyAll);
}

/*function isAll(student) {
    if (student.all === "all") {
        return true;
    } else {
        return false;
    }
}
*/

