const input = document.getElementById("websiteInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("blockedList");
const removeBtn = document.getElementById("removeBtn");

// updates the html which displays a simple list of the blocked sites
function updateList(blockedSites) {
  list.innerHTML = "";
  blockedSites.forEach(site => {
    const li = document.createElement("li");
    li.textContent = site;
    list.appendChild(li);
  });
}

// stores (in chrome local storage) the name of the site in the input field,
// when the user presses the add button
addBtn.addEventListener("click", async () => {
  const site = input.value.trim();
  if (site) {
    let { blockedSites } = await chrome.storage.local.get({ blockedSites: [] });
    if (!blockedSites.includes(site)) {
      blockedSites.push(site);
      await chrome.storage.local.set({ blockedSites });
      updateList(blockedSites);
    }
    input.value = "";
  }
});

// Generates a really long string of hard to copy characters
function generateRandomString(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }

// makes it so that when the remove button is pressed, it:
// 1. Creates a challenge container div
// 2. Displays some uncopyable text of a long and complicated string 
// 3. Adds a text field for input
// 4. Adds a 'confirm reset button'
// 5. When the 'confirm reset button' is pressed, checks if the text field = long string
// 6. Removes the blocked sites if the strings match
// This makes it so that its hard to habitually remove blocked apps
removeBtn.addEventListener("click", () => {
    const challengeString = generateRandomString(25);
  
    // Prevent creating multiple sets
    if (document.getElementById("challengeContainer")) return;
  
    const container = document.createElement("div");
    container.id = "challengeContainer";
  
    // Create the unselectable text
    const challengeText = document.createElement("p");
    challengeText.textContent = challengeString;
    // prevent copying with control v
    challengeText.style.userSelect = "none";
    challengeText.style.fontFamily = "monospace";
    challengeText.style.marginTop = "10px";
  
    // Create the input field
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.placeholder = "Type the above phrase";
    inputField.style.display = "block";
    inputField.style.marginTop = "5px";
  
    // Create the confirm button
    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = "Confirm Reset";
    confirmBtn.style.marginTop = "5px";
  
    // Confirm button logic
    confirmBtn.addEventListener("click", async () => {
      if (inputField.value === challengeString) {
        await chrome.storage.local.set({ blockedSites: [] });
        updateList([]);
        container.remove(); // Remove the UI
        alert("Blocked sites have been cleared.");
      } else {
        alert("The phrase you typed doesn't match.");
      }
    });
  
    // Add elements to container and page
    container.appendChild(challengeText);
    container.appendChild(inputField);
    container.appendChild(confirmBtn);
    document.body.appendChild(container);
  });
  



// Load the list on popup open, or make an empty list as a placeholder
chrome.storage.local.get({ blockedSites: [] }, (result) => {
  updateList(result.blockedSites);
});
