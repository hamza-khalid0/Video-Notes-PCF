/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
var pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./VideoNotesControl/index.ts":
/*!************************************!*\
  !*** ./VideoNotesControl/index.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   VideoNotesControl: () => (/* binding */ VideoNotesControl)\n/* harmony export */ });\nvar __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {\n  function adopt(value) {\n    return value instanceof P ? value : new P(function (resolve) {\n      resolve(value);\n    });\n  }\n  return new (P || (P = Promise))(function (resolve, reject) {\n    function fulfilled(value) {\n      try {\n        step(generator.next(value));\n      } catch (e) {\n        reject(e);\n      }\n    }\n    function rejected(value) {\n      try {\n        step(generator[\"throw\"](value));\n      } catch (e) {\n        reject(e);\n      }\n    }\n    function step(result) {\n      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);\n    }\n    step((generator = generator.apply(thisArg, _arguments || [])).next());\n  });\n};\nclass VideoNotesControl {\n  constructor() {\n    this.mediaRecorder = null;\n    this.recordedChunks = [];\n    this.currentStream = null;\n  }\n  init(context, notifyOutputChanged, state, container) {\n    this.context = context;\n    this.container = container;\n    // Status\n    this.statusDiv = document.createElement(\"div\");\n    this.statusDiv.style.marginBottom = \"8px\";\n    this.container.appendChild(this.statusDiv);\n    // Video preview\n    this.videoElement = document.createElement(\"video\");\n    this.videoElement.controls = true;\n    this.videoElement.style.width = \"100%\";\n    this.videoElement.style.maxHeight = \"240px\";\n    this.container.appendChild(this.videoElement);\n    // Start button\n    this.startButton = document.createElement(\"button\");\n    this.startButton.textContent = \"Start Recording\";\n    this.startButton.onclick = this.startRecording.bind(this);\n    this.container.appendChild(this.startButton);\n    // Stop button\n    this.stopButton = document.createElement(\"button\");\n    this.stopButton.textContent = \"Stop Recording\";\n    this.stopButton.disabled = true;\n    this.stopButton.onclick = this.stopRecording.bind(this);\n    this.container.appendChild(this.stopButton);\n    // Save button\n    this.saveButton = document.createElement(\"button\");\n    this.saveButton.textContent = \"Save Recording\";\n    this.saveButton.disabled = true;\n    this.saveButton.onclick = this.saveRecording.bind(this);\n    this.container.appendChild(this.saveButton);\n  }\n  startRecording() {\n    return __awaiter(this, void 0, void 0, function* () {\n      try {\n        var stream = yield navigator.mediaDevices.getUserMedia({\n          video: true,\n          audio: true\n        });\n        this.currentStream = stream;\n        this.videoElement.srcObject = stream;\n        this.videoElement.play();\n        this.mediaRecorder = new MediaRecorder(stream);\n        this.recordedChunks = [];\n        this.mediaRecorder.ondataavailable = event => {\n          if (event.data.size > 0) {\n            this.recordedChunks.push(event.data);\n          }\n        };\n        this.mediaRecorder.onstop = () => {\n          var blob = new Blob(this.recordedChunks, {\n            type: \"video/webm\"\n          });\n          this.videoElement.srcObject = null;\n          this.videoElement.src = URL.createObjectURL(blob);\n          this.videoElement.play();\n          this.saveButton.disabled = false;\n          // Stop all tracks\n          if (this.currentStream) {\n            this.currentStream.getTracks().forEach(track => track.stop());\n            this.currentStream = null;\n          }\n        };\n        this.mediaRecorder.start();\n        this.statusDiv.textContent = \"Recording...\";\n        this.startButton.disabled = true;\n        this.stopButton.disabled = false;\n        this.saveButton.disabled = true;\n      } catch (err) {\n        this.statusDiv.textContent = \"Error: \" + err;\n      }\n    });\n  }\n  stopRecording() {\n    if (this.mediaRecorder && this.mediaRecorder.state !== \"inactive\") {\n      this.mediaRecorder.stop();\n      this.statusDiv.textContent = \"Recording stopped.\";\n      this.startButton.disabled = false;\n      this.stopButton.disabled = true;\n    }\n  }\n  saveRecording() {\n    return __awaiter(this, void 0, void 0, function* () {\n      if (this.recordedChunks.length === 0) return;\n      var blob = new Blob(this.recordedChunks, {\n        type: \"video/webm\"\n      });\n      var arrayBuffer = yield blob.arrayBuffer();\n      var base64String = this.arrayBufferToBase64(arrayBuffer);\n      // Type-safe access for entityId and entityType\n      var entityId;\n      var entityType;\n      var ctx = this.context;\n      if (ctx.page && ctx.page.entityId && ctx.page.entityTypeName) {\n        entityId = ctx.page.entityId;\n        entityType = ctx.page.entityTypeName;\n      } else {\n        var val = this.context.parameters.value;\n        entityId = val._entityId;\n        entityType = val._entityTypeName;\n      }\n      if (!entityId || !entityType) {\n        this.statusDiv.textContent = \"Cannot determine record or entity type.\";\n        return;\n      }\n      var annotation = {\n        [\"objectid_\".concat(entityType, \"@odata.bind\")]: \"/\".concat(entityType, \"s(\").concat(entityId, \")\"),\n        \"subject\": \"Video Note\",\n        \"filename\": \"video_note_\".concat(Date.now(), \".webm\"),\n        \"mimetype\": \"video/webm\",\n        \"documentbody\": base64String\n      };\n      try {\n        yield this.context.webAPI.createRecord(\"annotation\", annotation);\n        this.statusDiv.textContent = \"Recording saved to Notes!\";\n        this.saveButton.disabled = true;\n      } catch (e) {\n        this.statusDiv.textContent = \"Failed to save: \" + e;\n      }\n    });\n  }\n  arrayBufferToBase64(buffer) {\n    var binary = '';\n    var bytes = new Uint8Array(buffer);\n    var len = bytes.byteLength;\n    for (var i = 0; i < len; i++) {\n      binary += String.fromCharCode(bytes[i]);\n    }\n    return btoa(binary);\n  }\n  updateView(context) {\n    // Optionally, load and show existing notes here\n  }\n  getOutputs() {\n    return {};\n  }\n  destroy() {\n    // No cleanup necessary\n  }\n}\n\n//# sourceURL=webpack://pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad/./VideoNotesControl/index.ts?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./VideoNotesControl/index.ts"](0, __webpack_exports__, __webpack_require__);
/******/ 	pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad = __webpack_exports__;
/******/ 	
/******/ })()
;
if (window.ComponentFramework && window.ComponentFramework.registerControl) {
	ComponentFramework.registerControl('Qz.VideoNotes.VideoNotesControl', pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad.VideoNotesControl);
} else {
	var Qz = Qz || {};
	Qz.VideoNotes = Qz.VideoNotes || {};
	Qz.VideoNotes.VideoNotesControl = pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad.VideoNotesControl;
	pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad = undefined;
}