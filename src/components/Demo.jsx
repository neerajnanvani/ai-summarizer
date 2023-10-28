import { useEffect, useState } from "react";
import {copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {

  const [article, setArticle] = useState({
    url: "",
    summary: ""
  });
  const [allArticles, setAllArticles] = useState([]);
  const [copiedURL, setCopiedURL] = useState("");

  useEffect(() => {    
    const articlesOfLocalStorage = JSON.parse(localStorage.getItem('articles'));

    if(articlesOfLocalStorage) {
      setAllArticles(articlesOfLocalStorage);
    }
  }, []);

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedURL(url);

    setTimeout(()=> {
      setCopiedURL("");
    }, 4000);
  }  

  const [getSummary, {error, isFetching}] = useLazyGetSummaryQuery();

  const submitURL = async(e) => {
    e.preventDefault();
    const {data} = await getSummary({articleUrl: article.url});

    if(data?.summary) {
      const newArticle = {
        ...article, summary: data.summary
      };

      const allUpdatedArticles = [newArticle, ...allArticles];

      setAllArticles(allUpdatedArticles);
      setArticle(newArticle);
      localStorage.setItem("articles", JSON.stringify(allUpdatedArticles));
    }
  }

  

  return (
    <section
        className="mt-16 w-full max-w-xl"
    >
      {/* Search  input */}

        <div className="flex flex-col w-full gap-2">
          <form
            className="relative flex justify-center items-center"
            onSubmit={submitURL}
          >
            <img 
              alt="link-icon"
              src={linkIcon}
              className="absolute left-0 my-2 ml-3 w-5"
            />
            <input 
              type="url" 
              placeholder="Enter a URL"
              value={article.url}
              onChange={(e) => setArticle({...article, url: e.target.value})}
              required={true}
              className="url_input peer"
            />
            <button
              type="submit"
              className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
            >
             <p>
             ↵
            </p>
            </button>
          </form>


          {/* Last Fetched Articles */}

          <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
            {
              allArticles.map((item, index) => (
                <div key={`link-${index}`}
                  onClick={() => setArticle(item)}
                  className="link_card"
                >
                  <button className="copy_btn" onClick={() => copyUrl(item.url)}>
                    <img
                      src={copiedURL === item.url ? tick : copy}
                      alt="copy-icon"
                      className="w-[40%] h-[40%] object-contain"
                    />
                  </button>
                  <p
                    className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate"
                  >
                    {item.url}
                  </p>

                </div>
              ))
            }
          </div>
        </div>
      {/* Results */}
      <div className="my-10 max-w-full flex justify-center items-center">

        {isFetching ? (
          <img src={loader} alt="loader" className="w-20 h-20 object-contain" />
        ) :
          error ? (
            <p className="font-inter font-bold text-black text-center">
              Well, that wasn't suppose to happen
              <br />
              <span className="font-satoshi font-normal text-gray-700">
                {error?.data.error}
              </span>
            </p>
          ) :
          (article.summary && (
            <div className="flex flex-col gap-3">
              <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                Article  <span className="blue_gradient">
                  Summary
                </span>
              </h2>
              <div className="summary_box">
                <p>
                  {article.summary}
                </p>
              </div>
            </div>
          ))
        }
      </div>
    </section>
  )
}

export default Demo