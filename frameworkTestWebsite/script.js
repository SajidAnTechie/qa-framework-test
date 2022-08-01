const submitBtn = document.querySelector(".submit");
const prevBtnSec = document.querySelector(".prev-1");
const nextBtnSec = document.querySelector(".next-1");
const prevBtnThird = document.querySelector(".prev-2");
const nextBtnThird = document.querySelector(".next-2");
const prevBtnFourth = document.querySelector(".prev-3");
const progressText = document.querySelectorAll(".step p");
const bullet = document.querySelectorAll(".step .bullet");
const nextBtnFirst = document.querySelector(".firstNext");
const day = document.querySelector('[data-qa="dob-day"]');
const year = document.querySelector('[data-qa="dob-year"]');
const month = document.querySelector('[data-qa="dob-month"]');
const progressCheck = document.querySelectorAll(".step .check");
const totalAgeContainer = document.querySelector('[data-qa="total-age"]');
const calculateAgeButton = document.querySelector('[data-qa="calculate-age"]');
let currentPage = 1;

const currentSlidePages = {
    1: document.querySelector(".slide-page-1"),
    2: document.querySelector(".slide-page-2"),
    3: document.querySelector(".slide-page-3"),
    4: document.querySelector(".slide-page-4")
}

nextBtnFirst.addEventListener("click", (e)=>{
  e.preventDefault();
  const currentPageIndex = currentPage;
  const stepperIndex = currentPage - 1;
  changeSlideAndBulletProgressCheck(currentPageIndex, stepperIndex, 'add');
  currentPage += 1;
});

nextBtnSec.addEventListener("click", (e)=>{
  e.preventDefault();
  const currentPageIndex = currentPage;
  const stepperIndex = currentPage - 1;
  changeSlideAndBulletProgressCheck(currentPageIndex, stepperIndex, 'add');
  currentPage += 1;
});

nextBtnThird.addEventListener("click", (e)=>{
  e.preventDefault();
  const currentPageIndex = currentPage;
  const stepperIndex = currentPage - 1;
  changeSlideAndBulletProgressCheck(currentPageIndex, stepperIndex, 'add');
  currentPage += 1;
});

submitBtn.addEventListener("click", ()=>{
  bullet[currentPage - 1].classList.add("active");
  progressCheck[currentPage - 1].classList.add("active");
  progressText[currentPage - 1].classList.add("active");
  currentPage += 1;
  setTimeout(()=>{
    alert("Your Form Successfully Signed up");
  },800);
});

prevBtnSec.addEventListener("click", (e)=>{
  e.preventDefault();
  const currentPageIndex = currentPage - 1;
  const stepperIndex = currentPage - 2;
  changeSlideAndBulletProgressCheck(currentPageIndex, stepperIndex, 'remove');
  currentPage -= 1;
});

prevBtnThird.addEventListener("click", (e)=>{
  e.preventDefault();
  const currentPageIndex = currentPage - 1;
  const stepperIndex = currentPage - 2;
  changeSlideAndBulletProgressCheck(currentPageIndex, stepperIndex, 'remove');
  currentPage -= 1;
});

prevBtnFourth.addEventListener("click", (e)=>{
  e.preventDefault();
  const currentPageIndex = currentPage - 1;
  const stepperIndex = currentPage - 2;
  changeSlideAndBulletProgressCheck(currentPageIndex, stepperIndex, 'remove');
  currentPage -= 1;
});

calculateAgeButton.addEventListener('click', (e)=> {
  e.preventDefault();
  const selectedDay = day.value;
  const selectedMonth = month.value;
  const selectedYear = year.value;

  const formatDate = `${selectedMonth}/${selectedDay}/${selectedYear}`;

  const age = getAge(formatDate);
  
  totalAgeContainer.textContent = age;
});

function getAge(dateString) {
  const dob = new Date(dateString);  
  const monthDiff = Date.now() - dob.getTime();  
    
  const ageDate = new Date(monthDiff);   
    
  const year = ageDate.getUTCFullYear();  
    
  const age = Math.abs(year - 1970);

  return age;
}

function changeSlideAndBulletProgressCheck(currentPageIndex, operation, action) {
  if(action === 'add') {
    currentSlidePages[currentPageIndex].style.display = "none";
    bullet[operation].classList.add("active");
    progressCheck[operation].classList.add("active");
    progressText[operation].classList.add("active");

    return;
  }

  currentSlidePages[currentPageIndex].style.display = "block";
  bullet[operation].classList.remove("active");
  progressCheck[operation].classList.remove("active");
  progressText[operation].classList.remove("active");
}
