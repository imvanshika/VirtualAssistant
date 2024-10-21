let box = document.querySelector(".box")
let btn = document.querySelector("button")
const speakfunc = (input) => {
  let speakInput = new SpeechSynthesisUtterance(input)
  window.speechSynthesis.speak(speakInput)
}
window.onload = () =>{
    greetFunc()
}
const greetFunc = () =>{
  let date = new Date()
  let hour = date.getHours()
  if (hour >=0 && hour < 12){
    speakfunc("Good morning, How can i help you!")
  }else if(hour >= 12 && hour < 16){
    speakfunc("Good afternoon, How can i help you!")
  }else{
    speakfunc("Good Evening, How can i help you!")
  }
}
const startVoiceInput = () => {
  if('webkitSpeechRecognition' in window)
  {
    let recognition = new webkitSpeechRecognition()
    recognition.lang = 'en-US'
    recognition.onresult = (e) =>{
      let spokenText = e.results[0][0].transcript
      handleCommands(spokenText.toLowerCase())
      box.classList.remove("btn-box")
      btn.innerHTML = `<i class="fa-solid fa-microphone-lines-slash"></i>`
    }
    recognition.start()
  } else{
    alert("Your Browser does not support voice input")
  }
}
btn.onclick = () =>{
  box.classList.add("btn-box")
  btn.innerHTML = `<i class="fa-solid fa-microphone-lines"></i>`
  startVoiceInput()
}
const weatherInfo = async(city) =>{
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=82e43c89e91318a008e0794f79537b02&units=metric`);
  const data = await response.json()
  if(data.cod == 200){
    const weatherDescription = data.weather[0].description;
    const temperature = data.main.temp;
    return `the weather in ${city} is currently ${weatherDescription} with a temperature ${temperature} degree celcius`
  }else{
    return "I couldn't fetch the weather information"
  }

}
const getNews = async() =>{
  const apiKey = 'e35d4734841049b4bbb5a10b5e0cfc14'
  const response = await fetch(`https://newsapi.org/v2/top-headlines?category=technology&apikey=${apiKey}`);
  const data = await response.json()
  if(data.status === 'ok'){
    const articles = data.articles.slice(0,5)
    let news = "Here are the latest news updates:"
    articles.forEach(article =>{
      news+= `${article.title}.`
    })
    return news
  }else{
    return "I couldn't fetch the news updates."
  }
   
}
const handleCommands = async (command) => {
  console.log(command);
  
  if(command.includes("hello")){
    speakfunc("Hello sir , How can i help you !")
  }else if(command.includes("hey") || command.includes("hi")){
    speakfunc("Hi sir , How can i help you !")
  }else if(command.includes("who are you") || command.includes("hu r u")){
    speakfunc("I am Virtual Assistant developed by Vanshika My job is to assist you with questions, tasks, or any other topics.")
  }else if (command.includes("open")){
    let commandWords = command.split(" ");
        let site = commandWords[commandWords.indexOf("open")+1];
        
        if (site) {
            speakfunc(`Opening ${site}`);
            window.open(`https://www.${site}.com`);
        } else {
            speakfunc("Please specify what to open.");
        }

  }else if (command.includes("run")){
     let commandSet = command.split(" ");
     let app = commandSet[commandSet.indexOf("run")+1];
     if(app){
      speakfunc(`running ${app}`);
      window.open(`${app}://`)
     }else{
      speakfunc("cannot found app")
     }

  }else if (command.includes("news")){
    const newsInfo = await getNews()
    speakfunc(newsInfo)
  }
  else if((command.includes("time") || command.includes("tell me time"))&& (!command.includes("date and time") && !command.includes("date and time"))){
    let time = new Date().toLocaleString(undefined , {hour:"numeric" , minute:"numeric"})
    speakfunc(`time is ${time}`)
  }else if((command.includes("date") || command.includes("tell me date")) && (!command.includes("date and time") && !command.includes("date and time"))){
    let date = new Date().toLocaleString(undefined , {day:"numeric" , month:"long"})
    speakfunc(`date is ${date}`)
  }else if (command.includes("search chat gpt")){
    speakfunc("opening chat gpt")
    window.open("https://www.chatgpt.com")
  }
  else if(command.includes("weather")){
    const city = command.split("weather in")[1] || command.split("weather")
    if (city){
      try{
        const weather = await weatherInfo(city);
        speakfunc(weather)

      }catch(error){
        speakfunc(error.message)
      }
    }else{
      speakfunc("please specify a city")

    }
    
  }else if(command.includes("play")){
    const song = command.substring(command.indexOf("play") + 5)
    if (song.trim()){
      speakfunc(`Playing ${song} on Youtube.`)
      window.open(`https://www.youtube.com/results?search_query=${song.trim()}`)
    }else{
      speakfunc("Please specify a song to play.")
    }
  } 

  else if(command.includes("date and time") || command.includes("time and date")){
    let time = new Date().toLocaleString(undefined , {hour:"numeric" , minute:"numeric"})
    let date = new Date().toLocaleString(undefined , {day:"numeric" , month:"long"})
    speakfunc(`date is ${date} and time is ${time}`)
  }
  else{
    speakfunc(`this is what i found on internet regarding  ${command}`)
    window.open(`https://www.google.com/search?q=${command}`)
  }
}

