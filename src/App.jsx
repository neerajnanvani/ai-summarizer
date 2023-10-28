import Hero from "./components/Hero";
import ArticleSummarizer from "./components/ArticleSummarizer";
import "./App.css"

const App = () => {
  return (
   <main>
    <div className="main">
        <div className="gradient"></div>
    </div>

    <div className="app">
        <Hero />
        <ArticleSummarizer />
    </div>
   </main>
  )
}

export default App;