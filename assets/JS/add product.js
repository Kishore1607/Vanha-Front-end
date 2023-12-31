// ---------------------------------------------------------//
/**
 * Handles the "back" button click by navigating to the previous page in the browser's history.
 */
const backButton = document.getElementById("back");
backButton.addEventListener("click", function back() {
  window.location.href = "./buyer profile.html";
});


//----------------------------error message-----------------------//
// Function to display an error message and hide it after 3 seconds
function errorBox(errorMessage) {
  var snackArea = document.getElementById("error");
  snackArea.className = "show";
  var message = document.getElementsByClassName("messSpan")[0];
  message.textContent = errorMessage;
  setTimeout(function () {
    snackArea.className = snackArea.className.replace("show", "");
  }, 3000);
}

// ------------------------create product----------------------//
const addProduct = document.getElementById("add_product");
addProduct.addEventListener("click", async function active() {
  const user_id = sessionStorage.getItem("email");

  const unique_id = crypto.randomUUID();

  const prodName = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const prodPrice = document.getElementById("price").value;
  const prodDate = document.getElementById("period").value;
  const duration = document.getElementById("duration").value;
  const category = document.getElementById("category").value;
  const lowPrice = document.getElementById("min_price").value;

  if (
    prodName === "" ||
    description === "" ||
    prodPrice === "" ||
    prodDate === "" ||
    duration === "" ||
    lowPrice === ""
  ) {
    alert("Please fill in all required fields");
    return;
  }

  // // Check if prodName contains only alphabets and is between 2 and 50 characters
  // if (/[A-Za-z0-9]+$/.test(prodName)) {
  //   alert("Product name should contain only alphabets and be 2-50 characters long");
  //   return;
  // }

  // Check if description is valid (you can customize this validation)
  // if (!descriptionValidation(description)) {
  //   alert("Please provide a valid description");
  //   return;
  // }

  // Check if prodPrice, lowPrice, and used_period are valid numbers
  const prodPriceNum = parseInt(prodPrice);
  const lowPriceNum = parseInt(lowPrice);
  const used_period = parseInt(prodDate);

  if (isNaN(prodPriceNum) || isNaN(lowPriceNum) || isNaN(used_period) || prodPriceNum <= 0 || lowPriceNum <= 0 || used_period <= 0) {
    alert("Please provide valid numeric values for prices and duration");
    return;
  }

  // Check if duration is 'month' or 'year'
  if (duration !== "month" && duration !== "year") {
    alert("Duration should be 'year' or 'month', no other options are allowed");
    return;
  }

  // Check if prodPrice is greater than lowPrice
  if (prodPriceNum <= lowPriceNum) {
    alert("Minimum price should be greater than the actual price");
    return;
  }

  const product = {
    unique: unique_id,
    name: prodName,
    description: description,
    price: prodPriceNum,
    minimumPrice: lowPriceNum,
    date: used_period,
    duration: duration,
    category: category,
    user_id: user_id,
  };

  const createProduct = `${serverPath}/home/create`;

  try {
    const response = await fetch(createProduct, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    if (data.statusCode === 200) {
      alert("Created Successfully");
      window.location.href = "./buyer profile.html";
    } else if (data.statusCode === 500) {
      window.location.href = "../error/500error.html";
    } else {
      let errorMessage = '';
      if (data.statusCode === 400) {
        errorMessage = data.message;
        errorBox(errorMessage);
      } else {
        errorMessage = 'An unknown error occurred.';
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

//------------------------------------------//
// Function to show requirement messages for input fields
function showRequirement(inputId) {
  const requirementMessage = getRequirementMessage(inputId);
  const requirementElement = document.getElementById(inputId + '-requirement');
  if (requirementElement) {
    requirementElement.textContent = requirementMessage;
  }
}

// Function to clear requirement messages
function clearRequirement() {
  const requirements = document.querySelectorAll('.requirement');
  requirements.forEach((requirement) => {
    requirement.textContent = '';
  });
}

// Function to get requirement messages based on the input field

function getRequirementMessage(inputId) {
  
  if (inputId === 'name') {
    return 'Enter your product name.';
  } else if (inputId === 'price') {
    return "Price should not exceed 1 crore Rs and not less than 10 Rs.";
  }else if (inputId === 'min_price') {
    return 'Minimum price should be lesser then price.';
  }else if (inputId === 'description') {
    return 'Give your description in points.';
  }else if (inputId === 'period') {
    return 'Give number of year or month.';
  }

}