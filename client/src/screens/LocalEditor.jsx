// src/components/LocalEditor.jsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import { FaPlay } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { updateCode, resetCode } from "../redux/slices/codeSlice";
import { API_URL } from "../utils/config";

const LANGUAGE_OPTIONS = [
  { label: "Python", value: "python" },
  { label: "C++", value: "cpp" },
  { label: "Java", value: "java" },
];

export default function LocalEditor() {
  const dispatch = useDispatch();
  const code = useSelector((state) => state.code);

  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [editorWidth, setEditorWidth] = useState(60);

  const containerRef = useRef(null);
  const isResizing = useRef(false);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setOutput("Running...");

    try {
      const response = await axios.post(
        `${API_URL}/api/code/execute`,
        { code: code[language], language },
        { withCredentials: true }
      );
      setOutput(response.data.output || "No output returned.");
    } catch (err) {
      console.error(err);
      setOutput("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setIsRunning(false);
    }
  }, [code, language]);

  // Resize handling logic
  const startResize = () => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
  };
  const stopResize = () => {
    isResizing.current = false;
    document.body.style.cursor = "default";
  };
  const handleMouseMove = (e) => {
    if (!isResizing.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    if (pct > 20 && pct < 80) setEditorWidth(pct);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopResize);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResize);
    };
  }, []);

  // Enhanced autocompletion and snippets
  const handleEditorMount = (editor, monaco) => {
    const registerProvider = (lang, items) => {
      monaco.languages.registerCompletionItemProvider(lang, {
        triggerCharacters: [".", " ", "(", "#"],
        provideCompletionItems: () => ({
          suggestions: items.map((item) => ({
            ...item,
            range: undefined,
          })),
        }),
      });
    };

    // Java completions
    registerProvider("java", [
      ...[
        "public",
        "private",
        "protected",
        "static",
        "final",
        "class",
        "interface",
        "void",
        "int",
        "String",
        "new",
        "this",
        "super",
        "return",
        "throws",
      ].map((kw) => ({
        label: kw,
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: kw,
      })),
      {
        label: "main",
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: [
          "public static void main(String[] args) {",
          '\t${1:System.out.println("Hello World");}',
          "}",
        ].join("\n"),
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: "Main method",
      },
      {
        label: "class",
        insertText: [
          "public class ${1:ClassName} {",
          "\t${2:// class content}",
          "}",
        ].join("\n"),
        kind: monaco.languages.CompletionItemKind.Snippet,
      },
    ]);

    // C++ completions
    registerProvider("cpp", [
      ...[
        "include",
        "namespace",
        "using",
        "template",
        "typename",
        "cout",
        "endl",
        "auto",
        "const",
        "volatile",
        "std",
      ].map((kw) => ({
        label: kw,
        kind:
          kw === "include"
            ? monaco.languages.CompletionItemKind.Snippet
            : monaco.languages.CompletionItemKind.Keyword,
        insertText: kw === "include" ? "#include <${1:header}>" : kw,
        insertTextRules:
          kw === "include"
            ? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            : undefined,
      })),
      {
        label: "main",
        insertText: ["int main() {", "\t${1:// code}", "\treturn 0;", "}"].join(
          "\n"
        ),
        kind: monaco.languages.CompletionItemKind.Snippet,
      },
    ]);

    // Python completions
    registerProvider("python", [
      ...[
        "def",
        "class",
        "lambda",
        "with",
        "import",
        "from",
        "as",
        "print",
        "return",
        "yield",
        "elif",
        "else",
        "try",
        "except",
      ].map((kw) => ({
        label: kw,
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: kw + (kw === "def" ? " ${1:name}($2):\n\t$0" : ""),
        insertTextRules:
          kw === "def"
            ? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
            : undefined,
      })),
      {
        label: "ifmain",
        insertText: ['if __name__ == "__main__":', "\t${1:main()}"].join("\n"),
        kind: monaco.languages.CompletionItemKind.Snippet,
      },
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white font-mono">
      {/* Toolbar */}
      <div className="flex items-center px-4 py-2 bg-[#111] border-b border-gray-800">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-900 text-green-300 p-2 rounded mr-4"
        >
          {LANGUAGE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center bg-green-600 hover:bg-green-500 disabled:opacity-50 p-2 rounded"
        >
          <FaPlay className="mr-2" /> Run
        </button>

        <button
          onClick={() => dispatch(resetCode())}
          className="ml-2 flex items-center bg-red-600 hover:bg-red-500 p-2 rounded"
        >
          Reset
        </button>
      </div>

      {/* Resizable Container */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden relative">
        {/* Code Editor */}
        <div className="h-full" style={{ width: `${editorWidth}%` }}>
          <MonacoEditor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code[language]}
            onMount={handleEditorMount}
            onChange={(val) =>
              dispatch(updateCode({ language, value: val || "" }))
            }
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              automaticLayout: true,
              quickSuggestions: true,
              suggestOnTriggerCharacter: true,
              snippetSuggestions: "top",
              scrollBeyondLastLine: false,
              roundedSelection: false,
              padding: { top: 10 },
              parameterHints: { enabled: true },
            }}
          />
        </div>

        {/* Gutter */}
        <div
          onMouseDown={startResize}
          className="w-2 cursor-col-resize bg-gray-700 hover:bg-gray-500"
          style={{ zIndex: 10 }}
        />

        {/* Output Panel */}
        <div className="flex-1 h-full p-4 overflow-auto bg-[#0a0a0a]">
          <pre className="whitespace-pre-wrap break-all text-green-300">
            {isRunning ? "Running..." : output}
          </pre>
          {!isRunning && output && (
            <div className="mt-4 text-sm text-gray-400">
              Execution completed{" "}
              {output.startsWith("Error:") ? "with errors" : "successfully"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
