import { useState, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";


const ListLessonForEdit = forwardRef((props, ref) => {
  const [root, setRoot] = useState({
      Title: "Список уроков",
      collapsed: false,
      Modules: []
    });

    const navigate = useNavigate();

    useImperativeHandle(ref, () => ({
        loadData: (data) => setRoot(data),
      }));

    const toggleRoot = () => {setRoot(prev => ({ ...prev, collapsed: !prev.collapsed }));};
    const toggleChild = (Id) => {
    setRoot(prev => ({
      ...prev,
      Modules: prev.Modules.map(c =>
        c.Id === Id ? { ...c, collapsed: !c.collapsed } : c
      )
    }));
  };
  
  return (
    <div>
      <svg style={{ display: "none" }}>
          <use href="#icon-expand">
            <symbol id="icon-expand" viewBox="0 -960 960 960">
              <path d="M480-372.92q-7.23 0-13.46-2.31t-11.85-7.92L274.92-562.92q-8.3-8.31-8.5-20.89-.19-12.57 8.5-21.27 8.7-8.69 21.08-8.69t21.08 8.69L480-442.15l162.92-162.93q8.31-8.3 20.89-8.5 12.57-.19 21.27 8.5 8.69 8.7 8.69 21.08t-8.69 21.08L505.31-383.15q-5.62 5.61-11.85 7.92T480-372.92"></path>
            </symbol>
          </use>
      </svg>
        {/*Header*/}
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
        <h2 style={{ margin: 0, flex: 1, fontSize:"20px" }}>Редактирование уроков</h2>
      </div>
      


      {!root.collapsed && (
        <div style={{ marginLeft: 25, marginTop: 10 }}>
          {root?.Modules?.map((child) => (
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
                  onClick={() => toggleChild(child.Id)}
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

                <span>{child.Title}</span>
              </div>

              {/* CHILD CONTENT */}
              {!child.collapsed && (
                <div style={{ marginLeft: 20, marginTop: 6 }}>
                  {child.Lessons?.map((f) => (
                    <div
                      key={f.Id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 4
                      }}
                    >
                      <span onClick={()=> navigate(`/course/${root?.Id}/edit/${f.Id}`)}>{f.Title}</span>
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

export { ListLessonForEdit }