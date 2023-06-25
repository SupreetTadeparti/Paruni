const bgEl = document.querySelector(".bg-img");
const errorEl = document.querySelector(".error-msg");
const containerEl = document.querySelector(".container");
const paraEl = document.querySelector(".para-input");
const submitBtn = document.querySelector(".sbmt-btn");
const result = document.querySelector(".result");

const transformValues = {
  0: {
    container: "translateY(200%)",
    result: "translate(-50%, -50vh)",
    bg: "translate(-50%, -45%)",
  },
  1: {
    container: "translateX(-200%)",
    result: "translate(50vh, -50%)",
    bg: "translate(-55%, -50%)",
  },
  2: {
    container: "translateY(-200%)",
    result: "translate(-50%, 50vh)",
    bg: "translate(-50%, -55%)",
  },
  3: {
    container: "translateX(200%)",
    result: "translate(-50vh, -50%)",
    bg: "translate(-45%, -50%)",
  },
};

submitBtn.addEventListener("click", async () => {
  // Get person names
  const text = paraEl.value;
  const doc = nlp(text);
  const people = doc
    .people()
    .json()
    .map((person) => person.text);

  if (people.length === 0) {
    errorEl.style.transform = "scale(1)";
    return;
  }

  errorEl.style.transform = "scale(0)";

  // Pulsating Effect
  containerEl.classList.add("hyperjump");

  setTimeout(async () => {
    const response = await generateText(people);
    const direction = Math.floor(Math.random() * 4);

    containerEl.style.transform = transformValues[direction].container;
    result.style.transform = transformValues[direction].result;
    bgEl.style.transform = transformValues[direction].bg;

    setTimeout(() => {
      result.textContent = response;
      result.classList.add("show-result");

      setTimeout(() => {
        containerEl.classList.remove("hyperjump");
      }, 1000);
    }, 2000);
  }, 3000);
});

// OpenAI story generator
async function generateText(people) {
  const prompt = `Write a short story in the form of one paragraph (around 4-5 sentences) with only the characters: ${people}. Don't supply any additional info such as the characters. Just respond with one paragraph.`;

  const requestBody = {
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0.3,
    max_tokens: 200,
  };

  const response = await fetch(`https://api.openai.com/v1/completions`, {
    body: JSON.stringify(requestBody),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  const data = await response.json();
  return data.choices[0].text;
}
