// toogle between dark and light mode
const toggleModeBTN = document.querySelector(".toggle-css-mode-btn-container");
toggleModeBTN.addEventListener("click", () => {
    // switch icon and name
    const modeIcon = document.querySelector(".mode-icon");
    const modeName = document.querySelector(".mode-name");
    const root = document.querySelector(":root");
    

    if(modeName.innerText == "Light Mode"){
        modeName.innerText = "Dark Mode";
        modeIcon.classList.add("fa-solid");

        root.style.setProperty("--very_dark_blue", "hsl(0, 0%, 98%)");
        root.style.setProperty("--darkblue", "hsl(0, 0%, 100%)");
        root.style.setProperty("--white", "hsl(200, 15%, 8%)");

    }
    else{
        modeName.innerText = "Light Mode";
        modeIcon.classList.remove("fa-solid");
        
        root.style.setProperty("--very_dark_blue", "hsl(207, 26%, 17%)");
        root.style.setProperty("--darkblue", "hsl(209, 23%, 22%)");
        root.style.setProperty("--white", "hsl(0, 0%, 100%)");
    }
});


async function getCountrysAPI() {

    // render all countrys in home section
    let response = await fetch("https://restcountries.com/v3.1/all");
    let data = await response.json();

    data.forEach(country => {

        try{
            const HTML_template = document.getElementById("template").content.cloneNode(true);

            HTML_template.querySelector(".flag-img").setAttribute("src", country.flags.png);
            HTML_template.querySelector(".information-country").innerText = country.name.common;
            HTML_template.querySelector(".Population").innerText = country.population;
            HTML_template.querySelector(".Region").innerText = country.region;
            HTML_template.querySelector(".Capital").innerText = country.capital;
    
            const cardsContainer = document.querySelector(".countrys-container");
            cardsContainer.append(HTML_template);
        }
        catch{
            alert("error")
        }

    });

    // open detail-modal section for countries and render data for specific country
    const countryCards = document.querySelectorAll(".country-card");
    countryCards.forEach((card) => {
        card.addEventListener("click", () => {

            // open modal
            const detailModal = document.querySelector(".country-detail-modal");
            detailModal.style.display = "grid";
            document.body.style.overflow = "hidden";

            // close detail modal
            const closeBtn = document.querySelectorAll(".back-btn");
            closeBtn.forEach((btn) => {
                btn.addEventListener("click", () => {
                    location.reload();
                });
            });
            
            async function detailModal_function(){
                const HTML_template = document.getElementById("details-template").content.cloneNode(true);

                let response = await fetch(`https://restcountries.com/v3.1/name/${card.children[1].children[0].innerText}?fullText=true`)
                let country = await response.json();
           
                    //native name
                    let nativeName_Object = Object.values(country[0].name.nativeName);

                    // currencies
                    let currencies_Object = Object.values(country[0].currencies);

                    // languages
                    const languages_Object = Object.values(country[0].languages);
                    languages_Object.forEach((language) => {
                        const lang_spans = document.createElement("span");
                        lang_spans.innerText = language;

                        HTML_template.querySelector(".languages").append(lang_spans);
                    });

                    // render data into detail container
                    HTML_template.querySelector(".flag-img-detail").setAttribute("src", country[0].flags.png);
                    HTML_template.querySelector(".header").innerText = country[0].name.common;
                    HTML_template.querySelector(".native-name").innerText = nativeName_Object[0].common;
                    HTML_template.querySelector(".population").innerText = country[0].population;
                    HTML_template.querySelector(".region").innerText = country[0].region;
                    HTML_template.querySelector(".sub-region").innerText = country[0].subregion;
                    HTML_template.querySelector(".capital").innerText = country[0].capital;
                    HTML_template.querySelector(".top-level-domain").innerText = country[0].tld;
                    HTML_template.querySelector(".currencies").innerText = currencies_Object[0].name;

                    // border countries
                    // first check if borders exist in countrys 
                    if("borders" in country[0]){
                        const borderCountries_Object = Object.values(country[0].borders);
                        borderCountries_Object.forEach((borderCountry) => {
                            let borderSpans = document.createElement("div");
                            borderSpans.classList.add("border-country-btn");
                            borderSpans.innerText = borderCountry;
    
                            HTML_template.querySelector(".btn-container").append(borderSpans);
                        });

                    }
                    else{
                        HTML_template.querySelector(".btn-container").innerText = "No Border Countries!";
                    }
                 
                    const detailContainer = document.querySelector(".detail-container");
                    detailContainer.append(HTML_template);
                
            }

            detailModal_function();

        });
    });
    
    // filter countries with searchbar
    const searchbar = document.getElementById("searchbar");
    searchbar.addEventListener("input", () => {
        const countrys = document.querySelectorAll(".information-country");
        countrys.forEach((country) => {
            if(country.innerText.toLowerCase().includes(searchbar.value)){
                country.parentElement.parentElement.style.display = "grid";
            }
            else{
                country.parentElement.parentElement.style.display = "none";
            }
        });
    });

    // filter countries by region
    const openList_BTN = document.querySelector(".filter-region-drop-down");

    openList_BTN.addEventListener("click", () => {
        const regionList = document.querySelector(".regions-list");
        regionList.classList.toggle("open-list-JS");

        const listElements = document.querySelectorAll(".region-list-item");

        listElements.forEach((element) => {
            element.addEventListener("click", () => {
                const regions = document.querySelectorAll(".Region");
                regions.forEach((region) => {
                    if(region.innerText == element.innerText){
                        region.parentElement.parentElement.parentElement.style.display = "grid";
                    }
                    else{
                        region.parentElement.parentElement.parentElement.style.display = "none";
                    }
                });
            });
        });
    });

    // border countries btn function
    window.addEventListener("click", async (e) => {

        try{
            // first clear container(but check wich element is clicked to avoid empty container) then render new data
            const container = document.querySelector(".btn-container");
            if(e.target.classList == "border-country-btn"){
                
                container.innerHTML = `<span class="sub-header">Border Countries: </span>`;

                let response = await fetch(`https://restcountries.com/v3.1/alpha/${e.target.innerText}`)
                let country = await response.json();

                const borders = country[0].borders;
                borders.forEach((border) => {
                    const div = document.createElement("div");
                    div.innerText = border;
                    div.classList.add("border-country-btn");
        
                    let nativeName_Object = Object.values(country[0].name.nativeName);
        
                    // currencies
                    let currencies_Object = Object.values(country[0].currencies);
                    // languages
                    const languages_Object = Object.values(country[0].languages);
                    languages_Object.forEach((language) => {
                        const lang_spans = document.createElement("span");
                        lang_spans.innerText = language;
        
                        document.querySelector(".languages").innerHTML = "";
                        document.querySelector(".languages").append(lang_spans)
                    });
        
                    document.querySelector(".flag-img-detail").setAttribute("src", country[0].flags.png);
                    document.querySelector(".header").innerText = country[0].name.common;
                    document.querySelector(".native-name").innerText = nativeName_Object[0].common;
                    document.querySelector(".population").innerText = country[0].population;
                    document.querySelector(".region").innerText = country[0].region;
                    document.querySelector(".sub-region").innerText = country[0].subregion;
                    document.querySelector(".capital").innerText = country[0].capital;
                    document.querySelector(".top-level-domain").innerText = country[0].tld;
                    document.querySelector(".currencies").innerText = currencies_Object[0].name;
        
                    container.append(div);

                });
            }
        }

        catch{
            alert("error")
        }

    });

}

getCountrysAPI();