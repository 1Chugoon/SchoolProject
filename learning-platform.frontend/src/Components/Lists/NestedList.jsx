
import { toast } from "react-toastify";
import config from "../../config.json"
import axios from "axios";

const NestedList = (({root, setRoot, refresh}) => {
  

// --- ROOT FUNCTIONS ---
const toggleRoot = () =>
  setRoot(prev => ({ ...prev, collapsed: !prev.collapsed }));

const addModule = async (title) => {
  await axios.post(`${config.BaseURL}/courses/${root.Id}/modules`, { title }, {withCredentials:true})
  .catch(toast.error("Ошибка"));
  
  await refresh();
  /*setRoot(prev => ({
    ...prev,
    Modules: [
      ...prev.Modules,
      {
        Id: crypto.randomUUID(),
        Title: "",
        Lessons: [],
        collapsed: false
      }
    ]
  }));*/
};

const deleteModule = async(moduleId) => {
  await axios.delete(`${config.BaseURL}/courses/modules/${moduleId}`, {withCredentials:true});
  await refresh();

  /*setRoot(prev => ({
    ...prev,
    Modules: prev.Modules.filter(m => m.Id !== moduleId)
  }));*/
};

// --- MODULE FUNCTIONS ---
const toggleModule = (moduleId) => {
  setRoot(prev => ({
    ...prev,
    Modules: prev?.Modules?.map(m =>
      m.Id === moduleId ? { ...m, collapsed: !m.collapsed } : m
    )
  }));
};

const updateModuleTitleAxios = async(moduleId, value,order) => {
  await axios.put(`${config.BaseURL}/courses/modules/${moduleId}`, {title:value, order:order}, {withCredentials:true})
  await refresh();
  /*setRoot(prev => ({
    ...prev,
    Modules: prev?.Modules?.map(m =>
      m.Id === moduleId ? { ...m, Title: value } : m
    )
  }));*/
};

const updateModuleTitle = (moduleId, value) => {
  setRoot(prev => ({
    ...prev,
    Modules: prev?.Modules?.map(m =>
      m.Id === moduleId ? { ...m, Title: value } : m
    )
  }));
}

// --- LESSON FUNCTIONS ---
const addLesson = async(moduleId) => {
  await axios.post(`${config.BaseURL}/courses/${root.Id}/lessons`, { moduleId:moduleId ,title:"" }, {withCredentials:true})
  .catch((e)=>{toast.error("Ошибка"); console.log(e)});
  await refresh();
  /*setRoot(prev => ({
    ...prev,
    Modules: prev?.Modules?.map(m =>
      m.Id === moduleId
        ? {
            ...m,
            Lessons: [
              ...m.Lessons,
              { Id: crypto.randomUUID(), value: "" }
            ]
          }
        : m
    )
  }));*/
};

const updateLesson = (moduleId, lessonId, value) => {
  setRoot(prev => ({
    ...prev,
    Modules: prev?.Modules?.map(m =>
      m.Id === moduleId
        ? {
            ...m,
            Lessons: m.Lessons?.map(l =>
              l.Id === lessonId ? { ...l, Title: value } : l
            )
          }
        : m
    )
  }));
};
const updateLessonAxios = async(moduleId, lessonId, value,order) => {
  await axios.put(`${config.BaseURL}/courses/modules/${moduleId}/lessons/${lessonId}`, {title:value, order:order}, {withCredentials:true})
  .catch((e)=> {toast.error("Ошибка"); console.log(e)})
  await refresh();
}

const deleteLesson = async(moduleId, lessonId) => {

  await axios.delete(`${config.BaseURL}/courses/modules/${moduleId}/lessons/${lessonId}`, {withCredentials:true})
  .catch((e)=> {toast.error("Ошибка"); console.log(e)});
  await refresh();
  /*setRoot(prev => ({
    ...prev,
    Modules: prev?.Modules?.map(m =>
      m.Id === moduleId
        ? {
            ...m,
            Lessons: m.Lessons.filter(l => l.Id !== lessonId)
          }
        : m
    )
  }));*/
};


  return (
    <div style={{ border: "1px solid #aaa", padding: 10, margin: 10 }}>
      {/* ROOT HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <svg
          onClick={toggleRoot}
          style={{
            width: 20,
            height: 20,
            cursor: "pointer",
            transform: root.collapsed ? "rotate(0deg)" : "rotate(180deg)",
            transition: "0.2s"
          }}
        >
          <use href="#icon-expand" />
        </svg>
        <h2 style={{ margin: 0, flex: 1 }}>{root.Title}</h2>

        <svg
          onClick={()=>addModule(" ")}
          style={{ width: 20, height: 20, cursor: "pointer" }}
        >
          <use href="#icon-plus" />
        </svg>
      </div>

      {/* ROOT CONTENT */}
      {!root.collapsed && (
        <div style={{ marginLeft: 25, marginTop: 10 }}>
          {root?.Modules?.map((child,index) => (
            <div
              key={child.Id}
              style={{
                border: "1px solid #ccc",
                padding: 8,
                marginBottom: 8,
                borderRadius: 6,
                background: "#fafafa"
              }}
            >
              {/* CHILD HEADER */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <svg
                  onClick={() => toggleModule(child.Id)}
                  style={{
                    width: 18,
                    height: 18,
                    cursor: "pointer",
                    transform: child.collapsed ? "rotate(0deg)" : "rotate(180deg)",
                    transition: "0.2s"
                  }}
                >
                  <use href="#icon-expand" />
                </svg>

                <input
                  placeholder="Название списка"
                  value={child.Title}
                  onBlur={(e) => updateModuleTitleAxios(child.Id, e.target.value,index)}
                  onChange={(e) => updateModuleTitle(child.Id, e.target.value)}
                  className="input mini-input"
                  style={{height:"20px"}}
                />

                <svg
                  onClick={() => addLesson(child.Id)}
                  style={{ width: 18, height: 18, cursor: "pointer" }}
                >
                  <use href="#icon-plus" />
                </svg>

                <span
                  onClick={() => deleteModule(child.Id)}
                  style={{ color: "red", cursor: "pointer" }}
                >
                  Удалить
                </span>
              </div>

              {/* CHILD CONTENT */}
              {!child.collapsed && (
                <div style={{ marginLeft: 20, marginTop: 6 }}>
                  {child?.Lessons?.map((f,index1) => (
                    <div
                      key={f.Id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 4
                      }}
                    >
                      <input
                        value={f.Title}
                        onChange={(e) =>
                          updateLesson(child.Id, f.Id, e.target.value)
                        }
                        onBlur={(e)=>{
                          updateLessonAxios(child.Id, f.Id, e.target.value,index1)
                        }}
                        className="input mini-input"
                        style={{ height:"20px" }}
                      />
                      <span
                        onClick={() => deleteLesson(child.Id, f.Id)}
                        style={{ color: "red", cursor: "pointer" }}
                      >
                        Удалить
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export { NestedList };
