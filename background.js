console.log("Jay Shree Ram");

console.log("This is Formarly AI from background script");

const url = 'https://api.openai.com/v1/chat/completions' // API_END POINT
const OPENAI_API_KEY = 'YOUR_API_KEY'; // Replace with your OpenAI API key


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {


            if(request.action == "formal-text"){


                (async () => {
                  async function getFormalText(text){
                    const prompt = {
                        "model": "gpt-3.5-turbo",
                        "messages": [
                          {
                            "role": "system",
                            "content": "You are an AI language model dedicated to making text formal and refined."
                          },
                          {
                            "role": "user",
                            "content": `Transform the following text into a formal and polished style: \n\n${text}`
                          }
                        ]
                      };


                    const ai_reqs = await fetch(url, {
                        method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${OPENAI_API_KEY}`
                            },
                            body: JSON.stringify(prompt),
                    });

                    const ai_resp = await ai_reqs.json();
                    if(ai_resp.error){
                        sendResponse({error: ai_resp.error});
                        return console.error(ai_resp.error.message);
                    }else{
                            console.log(ai_resp);
                            return ai_resp.choices[0].message.content;
                        }
                } 
                const formalText = await getFormalText(request.text);
                console.log(formalText);
                sendResponse({result: formalText});
            })();
                

                  
            }






    return true;
})