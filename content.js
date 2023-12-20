console.log("Jay Shree Ram");

console.log("This is Formarly AI from content script");

let text = "";
let textarea;

function createConversionButton() {
  const button = document.createElement("button");
  button.classList.add("formal");
  button.innerHTML = "Formal";
  const spinner = document.createElement("span");
  spinner.classList.add("spinner");
  button.onmouseover = () => {
    button.style.backgroundColor = "#14B8A6";
  };

  button.onmouseleave = () => {
    button.style.backgroundColor = "#2DD4BF";
  };

  document.body.appendChild(button);

  async function setLoading(state) {
    return new Promise((resolve) => {
      if (state === true) {
        setTimeout(() => {
          button.classList.add("loading");
          button.innerHTML = "";
          button.appendChild(spinner);
          resolve();
        }, 50);
      } else {
        setTimeout(() => {
          button.classList.remove("loading");
          button.innerHTML = "Formal";
          resolve();
        }, 50);
      }
    });
  }

  button.addEventListener("click", async function () {
    await setLoading(true);

    try {
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage(
          { action: "formal-text", text },
          (response) => {
            resolve(response);
          }
        );
      });

      if (response.result) {
        if (textarea.getAttribute("data-lexical-editor")) {
          // For Lexical Editors.
          textarea.querySelector(
            'span[data-lexical-text="true"]'
          ).childNodes[0].data = response.result;
        } else {
            // For Normal Ones.
          textarea.innerText = response.result;
        }
      } else {
        console.error(response.error.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      await setLoading(false);
    }
  });
  function toggleButtonVisibility() {
    textarea = document.activeElement;   
    const isSupported = () => {
            const name = textarea?.tagName?.toLowerCase();
               if(name.includes('select')){
                return false;
               }else if(name.includes('div')){
                        if(textarea.getAttribute("data-lexical-editor") || textarea.getAttribute('role') == 'textbox'){
                            return true;
                        }else{
                            return false;
                        }
               }else if(name.includes('textarea')){
                return true;
               }else if(name.includes('input') && textarea.getAttribute('type') === 'text'){
                return true;
               }
               else {
                return false;
               }
    }

    if (textarea.innerText.length >= 10 && isSupported() || textarea.innerHTML.length >= 10 && isSupported()) {
      text = textarea.innerText || textarea.innerHTML;
      button.style.display = "block";
      const rect = textarea.getBoundingClientRect();
      button.style.left = rect.left + rect.width + 5 + "px";
      button.style.top = rect.top - 5 + "px";
    } else {
      text = "";
      button.style.display = "none";
    }
  }

  document.addEventListener("input", toggleButtonVisibility, true);

}

if (document.readyState) {
  createConversionButton();
}
