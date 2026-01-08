const c=globalThis.chrome;console.log("LeetCode Smart Analysis content script loaded.");function u(){let t=document.getElementById("smart-analysis-modal");if(t)return t;t=document.createElement("div"),t.id="smart-analysis-modal",t.style.cssText=`
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 99999;
  `;const e=document.createElement("div");e.id="smart-analysis-modal-content",e.style.cssText=`
    background: #1a1a1a;
    margin: 40px auto;
    width: 90%;
    max-width: 1000px;
    height: 80vh;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  `;const o=document.createElement("div");o.style.cssText=`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #333;
    background: #1a1a1a;
    flex-shrink: 0;
  `;const a=document.createElement("h2");a.textContent="🧠 Smart Analysis",a.style.cssText=`
    margin: 0;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
  `;const s=document.createElement("button");s.innerHTML="✕",s.style.cssText=`
    background: transparent;
    border: none;
    color: #888;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;
  `,s.addEventListener("click",n=>{n.stopPropagation(),t.style.display="none",console.log("[Smart Analysis] Modal closed")}),o.appendChild(a),o.appendChild(s);const l=document.createElement("div");if(l.id="smart-analysis-react-root",l.style.cssText=`
    flex: 1;
    overflow: auto;
    background: #1a1a1a;
    -webkit-overflow-scrolling: touch;
  `,e.appendChild(o),e.appendChild(l),t.appendChild(e),document.body.appendChild(t),t.addEventListener("click",n=>{n.target===t&&(t.style.display="none",console.log("[Smart Analysis] Modal closed by background click"))}),window.addEventListener("keydown",n=>{n.key==="Escape"&&t.style.display==="block"&&(t.style.display="none",console.log("[Smart Analysis] Modal closed by Escape"))}),!document.querySelector('script[data-smart-analysis="1"]')){const n=document.createElement("script");n.src=c.runtime.getURL("smartAnalysisUI.js"),n.type="module",n.setAttribute("data-smart-analysis","1"),document.head.appendChild(n),console.log("[Smart Analysis] React UI script loaded")}return console.log("[Smart Analysis] Modal ensured"),t}function i(){const t=u();console.log("[Smart Analysis] openModal invoked"),t.style.display="block",t.style.removeProperty("visibility"),t.style.removeProperty("opacity"),console.log("[Smart Analysis] Modal opened (display=block set)")}function d(){if(console.log("[Smart Analysis] injectSmartAnalysisButton start"),document.getElementById("smart-analysis-button"))return;const t=document.querySelector(".flexlayout__tabset_tabbar_inner_tab_container")||document.querySelector(".flexlayout__tabbar_inner")||document.querySelector('[role="tablist"]')||document.querySelector(".ant-tabs-nav")||null;if(!t){console.warn("LeetCode tab container not found. Falling back to floating Smart Analysis button."),m();return}console.log("[Smart Analysis] Tab container found, injecting button");const e=document.createElement("button");e.id="smart-analysis-button",e.innerHTML="🧠 Smart Analysis",e.style.cssText=`
    background: transparent;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 13px;
    color: var(--text-primary, #888);
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: 8px;
    border-radius: 4px;
    transition: all 0.2s;
    white-space: nowrap;
    pointer-events: auto;
    position: relative;
    z-index: 2;
  `,e.addEventListener("mouseover",()=>{e.style.color="#fff",e.style.backgroundColor="rgba(255, 255, 255, 0.1)"}),e.addEventListener("mouseout",()=>{e.style.color="var(--text-primary, #888)",e.style.backgroundColor="transparent"}),t.appendChild(e);const o=e.getBoundingClientRect();console.log("[Smart Analysis] Button added to tab container",{x:Math.round(o.x),y:Math.round(o.y),width:Math.round(o.width),height:Math.round(o.height)}),e.addEventListener("click",a=>{a.preventDefault(),a.stopPropagation(),console.log("[Smart Analysis] Tab button click handler fired"),i()},!0),["pointerdown","mousedown","mouseup"].forEach(a=>{e.addEventListener(a,s=>{s.preventDefault(),s.stopPropagation(),console.log(`[Smart Analysis] Tab button ${a} handler fired`),i()},!0)}),console.log("[Smart Analysis] Tab button listener attached (capture)")}function m(){if(document.getElementById("smart-analysis-button"))return;const t=document.createElement("button");t.id="smart-analysis-button",t.innerHTML="🧠 Smart Analysis",t.style.cssText=`
    position: fixed;
    bottom: 16px;
    right: 16px;
    background: #1a1a1a;
    color: #fff;
    border: 1px solid #333;
    padding: 10px 14px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.35);
    cursor: pointer;
    z-index: 99999;
    font-size: 14px;
    pointer-events: auto;
  `,document.body.appendChild(t),console.log("[Smart Analysis] Floating button added"),t.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),console.log("[Smart Analysis] Floating button click handler fired"),i()}),console.log("[Smart Analysis] Floating button listener attached")}document.addEventListener("click",t=>{const e=t.target;e&&(e.id==="smart-analysis-button"||e.closest("#smart-analysis-button"))&&console.log("[Smart Analysis] Document capture saw click on Smart Analysis button")},!0);const p=new MutationObserver(()=>{document.getElementById("smart-analysis-button")||d()});p.observe(document.body,{childList:!0,subtree:!0});const r=()=>{document.getElementById("smart-analysis-button")||d()};r();document.readyState==="complete"||document.readyState==="interactive"?(setTimeout(r,500),setTimeout(r,1500)):window.addEventListener("DOMContentLoaded",()=>{r(),setTimeout(r,500),setTimeout(r,1500)});
