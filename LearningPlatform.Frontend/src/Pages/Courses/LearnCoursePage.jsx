import { useEffect, useState } from "react";
import ListOnLesson from "../../Components/Lists/ListOnLesson";
import MainBtns from "../../Components/Buttons/MainBtns";
import HeaderOnLesson from "../../Components/Header/HeaderOnLesson";

import { toast } from "react-toastify";
import config from "../../config.json";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import remarkGfm from "remark-gfm";

import rehypeRaw from "rehype-raw"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import "./markdown.css"


import ReactMarkdown from "react-markdown"

function LearnCoursePage() {
  const [materials, setMaterials] = useState([]);
  const [text, setText] = useState();
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const id = useParams().id;
  const idLesson = useParams().idLesson;

  const navigate = useNavigate();
  
const goToNextLesson = () => {
  if (!materials?.Modules?.length) return;

  // Сортируем модули по Order
  const sortedModules = [...materials.Modules].sort((a, b) => a.Order - b.Order);

  const currentModuleIndex = sortedModules.findIndex(
    (m) => m.Id === id
  );

  if (currentModuleIndex === -1) return;

  const currentModule = sortedModules[currentModuleIndex];

  // Сортируем уроки по Order
  const sortedLessons = [...currentModule.Lessons].sort(
    (a, b) => a.Order - b.Order
  );

  const currentLessonIndex = sortedLessons.findIndex(
    (l) => l.Id === idLesson
  );

  if (currentLessonIndex === -1) return;

  // 1. Если есть следующий урок в текущем модуле
  if (currentLessonIndex + 1 < sortedLessons.length) {
    const nextLesson = sortedLessons[currentLessonIndex + 1];

    navigate(`/course/${currentModule.Id}/learn/${nextLesson.Id}`);
    return;
  }

  // 2. Если урок последний → проверяем следующий модуль
  if (currentModuleIndex + 1 < sortedModules.length) {
    const nextModule = sortedModules[currentModuleIndex + 1];

    if (!nextModule.Lessons?.length) return;

    const firstLesson = [...nextModule.Lessons].sort(
      (a, b) => a.Order - b.Order
    )[0];

    navigate(`/course/${nextModule.Id}/learn/${firstLesson.Id}`);
  }
};


  useEffect(() => {

  setText(null);
  setMaterials([]);

      axios
      .get(config.BaseURL+ `/modules/${id}/course`)
      .then(datas => {
        setMaterials(datas.data);
      })
      .catch((err) => {
        switch(err.response?.status){
          case 404:toast.error("Не найден ресурс");break;
          case 500: toast.error("Ошибка сервера");break
        }
      });

      axios
      .get(config.BaseURL+ `/modules/${id}/lessons/${idLesson}/content`)
      .then(text => setText(text.data))
      .catch((err) => {
        switch(err.response?.status){
          case 404:toast.error("Не найден ресурс");break;
          case 500: toast.error("Ошибка сервера");break
        }
      });
    }, [id,idLesson]);  

  return (
    <div className="learn-page">
  <HeaderOnLesson />

  <div className="learn-page-body">

    <div className="mobile-menu-header">
      <button
        type="button"
        className="mobile-menu-button"
        onClick={() => setIsMenuOpen(prev => !prev)}
      >
        <span>Содержание урока</span>
        <span className={`arrow ${isMenuOpen ? 'up' : ''}`}>
          ▼
        </span>
      </button>
    </div>

    <aside className={`left-panel ${isMenuOpen ? 'mobile-open' : ''}`}>
      <ul>
        {materials?.Modules?.map((item, index) => (
          <li key={item.Id ?? index}>
            <ListOnLesson data={item} />
          </li>
        ))}
      </ul>
    </aside>

    <main className="main-info">
      <div className="markdown-body">
        <ReactMarkdown
          urlTransform={(url) => {
    const isImage = /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(url);

    if (isImage) {
      return `${config.BaseURL}/modules/${id}/lessons/${idLesson}/files/${url}`;
    }

    return url;
  }}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSlug,
          rehypeAutolinkHeadings
        ]}

        components={{
          code({node, inline, className, children, ...props}) {

            const match = /language-(\w+)/.exec(className || "")

            return !inline && match ? (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }
        }}
        >
          {text}
        </ReactMarkdown>
      </div>

      <div className="bottom-area">
        <MainBtns
          Style="purple-btn"
          Height="50px"
          Width="100px"
          Text="Далее"
          ZIndex="2"
          Funct={goToNextLesson}
        />
      </div>
    </main>

  </div>
</div>
  );
}

export default LearnCoursePage;