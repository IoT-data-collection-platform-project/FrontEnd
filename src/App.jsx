import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Sidebar from './sidebar/sidebar';
import DeviceApprovePage from './registerDevice/DeviceApprovePage';

function App() {
  return (
    <BrowserRouter>
      
      {/* 전체화면 컨테이너 */}
      <div className="flex w-full h-screen overflow-hidden bg-[#262a2b]">
        
        {/* 좌측 고정 사이드 바 */}
        <Sidebar />

        {/* 우측 메인 영역 */}
        <div className="flex-1 overflow-y-auto">

          {/* URL에 따라 화면 바꾸기 */}
          <Routes>

            <Route path="/device/approveReq" element={<DeviceApprovePage />} />

          </Routes>

        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;