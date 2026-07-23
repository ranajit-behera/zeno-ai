import React, { useState } from "react";
import { FiPlus, FiTrash2, FiCopy  } from "react-icons/fi";
import axios from "axios";
const serverUrl = import.meta.env.VITE_SERVER_URL;
import toast from "react-hot-toast";
import { CLIENT_URL } from "../config";


const THEMES = ["light", "dark", "glass", "neon"];

const TONES = ["friendly", "professional", "sales"];

function Builder({ user, setUser }) {
  const [editAssistant, setEditAssistant] = useState(!user?.isSetupComplete);

  const [assistantName, setAssistantName] = useState(user?.assistantName || "");
  const [businessName, setBusinessName] = useState(user?.businessName || "");
  const [businessType, setBusinessType] = useState(user?.businessType || "");
  const [businessDescription, setBusinessDescription] = useState(
    user?.businessDescription || "",
  );

  const [theme, setTheme] = useState(user?.theme || "dark");
  const [tone, setTone] = useState(user?.tone || "friendly");

  const [geminiApiKey, setGeminiApiKey] = useState(user?.geminiApiKey || "");

  const [pages, setPages] = useState(user?.pages || []);

  const [pageName, setPageName] = useState("");

  const [pagePath, setPagePath] = useState("");

  const [pageKeywords, setPageKeywords] = useState("");

  const [loading, setLoading] = useState(false);

// Add-Page Function
  const addPage = ()=>{
    if(!pageName.trim() || !pagePath.trim()) return;

    const newPage = {
      name: pageName,
      path: pagePath,
      keywords: pageKeywords
        .split(",") //Split the string wherever comma appears
        .map((key)=> key.trim()) //Remove extra spaces from each keyword
        .filter(Boolean), 
    }


    setPages((prevPages) => [...prevPages, newPage]);

    setPageName("");
    setPagePath("");
    setPageKeywords("");
  }

// Remove-Page Function
  const removePage = (index)=>{
    // Store all the pages except index one
    const updatePages = pages.filter((_,idx)=> idx !== index);

    setPages(updatePages);
  }

// Save Assistant Function
  const saveAssistant = async()=>{
    setLoading(true);
    try {
      const data = {
        assistantName,
        businessName,
        businessType,
        businessDescription,
        tone,
        theme,
        geminiApiKey,
        pages
      }
      
      // POST req to save assistant
      const res = await axios.post(serverUrl + "/api/user/save-assistant", data, {withCredentials: true})

      console.log(res.data)

      // Update or user
      setUser(res.data.user)

      // SetEditedAssistant to false
      setEditAssistant(false);

      // Toast for success message
      toast.success("Assistant Saved Successfully");

      setLoading(false);

    } catch (error) {
      // Toast for error message
      toast.error("Failed to save assistant");
      setLoading(false);
      console.log(error);
    }
  }

// Count Remaining Message left
  const remainingMessages = Math.max(0, (user?.requestLimit || 0) - (user?.totalMessage || 0));

// Count Remaining Days left
  const RemainingDays = user?.proExpiresAt
    ? Math.max(
        0,
        Math.ceil(
          // Expiry date - Current date = Remaining time in milliseconds, So to convert in to 'Days' we devided by '1 Day'
          // (Expiry date - Current date ) /  (1000 ms × 60 sec × 60 min × 24 hours)
          (new Date(user?.proExpiresAt) - new Date()) / (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

// Embeded Code 
  const embedCode = `<script src="${CLIENT_URL}/assistant.js" data-user-id="${user?._id}"></script>`;
  

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#081028]">
            Assistant Builder
          </h2>
          <p className="text-gray-500 mt-1">Customize your virtual assistant</p>
        </div>

{/* Show assistant details when setup is complete - START */}
        {user?.isSetupComplete && !editAssistant && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
            <p className="txt-sm text-gray-400">Assistant</p>

{/* Display assistant name and basic status */}
            <h2 className="text-3xl font-bold text-[#081028] mt-1">{user?.assistantName}</h2>

            <p className="to-gray-500 mt-3 leading-7">Your assistant is ready to use on your website.</p>

{/* Show assistant plan, Gemini status, and usage details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">

{/* Show the user's current subscription plan */}
              <div className="rounded-2xl border border-gray-100 bg-[#f8fafc] p-4">

                <p className="text-sm text-gray-400">Current Plan</p>             
                <h2 className="text-xl font-bold text-[#081028] mt-1 capitalize">{user?.plan}</h2>

              </div>

{/* Show Gemini API status with dynamic status color */}
              <div className="rounded-2xl border border-gray-100 bg-[#f8fafc] p-4">

                <p className="text-sm text-gray-400">Gemini Status</p> 

                <h2 className={`text-xl font-bold text-[#081028] mt-1 capitalize ${user?.geminiStatus === "active"
                  ? "text-emerald-600"
                  : user?.geminiStatus === "invalid"
                  ? "text-red-500"
                  : "text-amber-500"
                }`}>{user?.geminiStatus}</h2>

              </div>

{/* Free plan: show remaining messages | Paid plan: show remaining expiry days */}
              <div className="rounded-2xl border border-gray-100 bg-[#f8fafc] p-4">

                <p className="text-sm text-gray-400">
                  {user?.plan === "free"
                    ? "Messages Left"
                    : "Plan Expiry"
                  }
                </p>             
                <h2 className="text-xl font-bold text-[#081028] mt-1 capitalize">{user?.plan === "free"
                  ? remainingMessages
                  : `${RemainingDays} Days`
                }
                </h2>
              </div>
            </div>

{/* Explaination where to add the assistant script on the website */}
            <div className="mt-7">
              <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-4">
                <p className="text-sm font-semibold text-amber-900">
                  Where to paste this script?
                </p>
                <p className="text-sm text-amber-700 mt-2 leading-6">
                  Paste this script before the closing
                  {" "}
                  <span className="font-semibold">{"</body>"}</span>
                  {" "}
                  tag of your website HTML file.
                  <br/>
                  <br/>
                  Example:
                </p>

{/* Show an example of the assistant script placement */}
                <pre className="mt-3 bg-[#0b1020] text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto">
  {`
  <body>

    Your Website content 
    
    <script src="${CLIENT_URL}/assistant.js" data-user-id="${user?._id}"></script>

  </body>
  `}
                </pre>
              </div>

              <p className="mt-3 text-sm font-medium text-[#081028] mb-3">Embed Code</p>
            </div>

{/* Display the generated embed code */}
            <div className="relative">
              <textarea readOnly value={embedCode} className="w-full h-20 bg-[#0b1020] text-emerald-400 rounded-2xl p-4 text-sm font-mono resize-none outline-none"/>

{/*Button to Copy the Embed Code  */}
              <button
                onClick={()=>{
                  navigator.clipboard.writeText(embedCode); //Copy embed code to clipboard
                  toast.success("Copied");
                }} 
                className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-white flex items-center justify-center cursor-pointer">
                <FiCopy />
              </button>
            </div>

{/* Edit Assistant Button */}
            <button onClick={()=>setEditAssistant(true)} className="mt-6 h-12 px-6 rounded-2xl bg-linear-to-r from-purple-500 to-emerald-500 text-white font-medium">Edit Assistant</button>
          </div>
        )}
{/* Show assistant details when setup is complete - END */}

{/* Input Container start*/}
        {editAssistant && 
        <div className="space-y-6">

{/* Basic Info start*/}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 ">
            <h2 className="text-lg font-semibold  mb-5">Basic Information</h2>

            <div className="space-y-4">
              <input
                onChange={(e) => setAssistantName(e.target.value)}
                value={assistantName}
                type="text"
                placeholder="Assistant Name"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3"
              />

              <input
                onChange={(e) => setBusinessName(e.target.value)}
                value={businessName}
                type="text"
                placeholder="Business Name"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3"
              />

              <input
                onChange={(e) => setBusinessType(e.target.value)}
                value={businessType}
                type="text"
                placeholder="Business Type"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3"
              />

              <textarea
                rows={4}
                onChange={(e) => setBusinessDescription(e.target.value)}
                value={businessDescription}
                type="text"
                placeholder="Business Description"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 resize-none"
              />
            </div>
          </div>
{/* Basic Info end*/}

{/* Appearance Info start */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-5">Appearance</h2>

{/* Theme start */}
            <div>
              <label className="block text-sm text-gray-600 mb-3 ">Theme</label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Mapping the theme */}
                {THEMES.map((item, idx) => (
                  <button
                    onClick={()=> setTheme(item)}
                    key={idx}

                    // highlight the selected theme
                    className={`py-3 rounded-2xl border-2 capitalize 
                      ${theme === item 
                      ? "border-purple-500 bg-purple-50 text-purple-700" 
                      : "border-gray-200"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
{/* Theme end */}

{/* Tone start */}
            <div className="mt-6">
              <label className="block text-sm text-gray-600 mb-3 ">Assistant Tone</label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Mapping the tones */}
                {TONES.map((item, idx) => (
                  <button
                    onClick={()=> setTone(item)}
                    key={idx}

                    // highlight the selected tone
                    className={`py-3 rounded-2xl border-2 capitalize 
                      ${tone === item 
                      ? "border-purple-500 bg-purple-50 text-purple-700" 
                      : "border-gray-200"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
{/* Tone end */}

          </div>
{/* Appearance Info end */}

{/* Gemini API key  start*/}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
              <div>
                <h2 className="text-lg font-semibold">Gemini API KEY</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Add your Gemini Api key to power your assistant
                </p>
              </div>

              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl bg-linear-to-r from-purple-500 to-emerald-500 text-white text-sm font-medium hover:scale-[1.02] transition-all cursor-pointer">
              Get API KEY</a>
            </div>
            
            {/* API KEY */}
            <input
              type="password"
              placeholder="Alza..."
              onChange={(e)=>setGeminiApiKey(e.target.value)}
              value={geminiApiKey}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3"
            />
            <p className="text-xs text-gray-400 mt-3 leading-6">
              Your API key is securely stored and only used for generating AI responses.
            </p>
          </div>
{/* Gemini API key  start*/}

{/* Navigate Pages start */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-5 flex-wrap">
              <div>
                <h2 className="text-lg font-semibold">Navigation Pages</h2>
                <p className="text-sm text-gray-400">
                  Assistant can redirect users
                </p>
              </div>

              {/* Add Page Button */}
              <button onClick={addPage} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-purple-500 to-emerald-500 text-white text-sm cursor-pointer hover:scale-[1.02] transition-all">
                <FiPlus/> Add
              </button>
            </div>


{/* Pages Info start*/}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              onChange={(e)=>setPageName(e.target.value)}
              value={pageName}
              type="text"
              placeholder="Page Name"
              className="border border-gray-200 rounded-2xl px-4 py-3 "
            />

            <input
              onChange={(e)=>setPagePath(e.target.value)}
              value={pagePath}
              type="text"
              placeholder="/pricing"
              className="border border-gray-200 rounded-2xl px-4 py-3 "
            />

            <input
              onChange={(e)=>setPageKeywords(e.target.value)}
              value={pageKeywords}
              type="text"
              placeholder="pricing, plan"
              className="border border-gray-200 rounded-2xl px-4 py-3 "
            />
          </div>
{/* Pages Info end */}

{/* Display Pages  start*/}
          <div className="mt-5 space-y-3">
            {
              pages.map((page, idx)=>(
                <div key={idx} className="flex items-center justify-between border border-gray-100 rounded-2xl p-4">
                  <div>
                    <p className="font-medium">{page.name}</p>
                    <p className="text-sm text-gray-400">{page.path}</p>
                    {/* <p className="text-sm text-gray-400">{page.keywords} </p> */}
                  </div>

                  <button onClick={()=> removePage(idx)} className="text-red-500 cursor-pointer">
                    <FiTrash2/>
                  </button>
                </div>
              ))
            }
          </div>
{/* Display Pages  end*/}

          </div>
{/* Navigate Pages end */}

        <button onClick={saveAssistant} disabled={loading} className="w-full h-14 rounded-2xl bg-linear-to-r from-purple-500 to-emerald-500 text-white font-semibold">
          {
            loading? "Saving..." : user?.isSetupComplete? "Update Assistant" : "Save Assistant"
          }
        </button>

        </div>}
{/* Input container end */}

      </div>
    </div>
  );
}

export default Builder;
