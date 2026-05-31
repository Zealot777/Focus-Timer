//utils.js
import Swal from 'sweetalert2';


export const showDeleteConfirm = (onConfirm) => {
  Swal.fire({
  title: "정말로 삭제하시겠습니까?",
  text: "삭제한 후에는 다시 되돌릴 수 없습니다.",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "예",
  cancelButtonText: "아니오"
  }).then((result) => {
    if (result.isConfirmed) onConfirm();
  });
};
export const showTimerSetup = (subjects, onStart) => {
  const options = subjects.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

  Swal.fire({
    title: '공부할 과목과 시간을 정하세요',
    html: `
      <select id="subject-select" class="swal2-select">
        ${options}
      </select>
      <input type="number" id="time-input" class="swal2-input" value="25" min="1">
    `,
    confirmButtonText: '시작!',
    preConfirm: () => {
      const subjectId = document.getElementById('subject-select').value;
      const time = document.getElementById('time-input').value;
      return { subjectId, time };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const subject = subjects.find(s => s.id === result.value.subjectId);
      onStart(subject, result.value.time);
    }
  });
};


export const showSubjectManager = (subjects, currentSubject, onSelect, onDelete, onAdd) => {
  // 팝업 내부의 HTML을 구성합니다.
  const subjectListHtml = subjects.map(s => `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; padding:5px; border-bottom:1px solid #eee;">
      <span style="font-weight: ${currentSubject?.id === s.id ? 'bold' : 'normal'}; color: ${currentSubject?.id === s.id ? '#3085d6' : '#333'}">
        ${s.name}
      </span>
      <div>
        <button type="button" class="select-btn" data-id="${s.id}" style="margin-right:5px">선택</button>
        <button type="button" class="delete-btn" data-id="${s.id}" style="color:red">삭제</button>
      </div>
    </div>
  `).join('');

  Swal.fire({
    title: '과목 관리',
    html: `
      <div style="max-height: 300px; overflow-y: auto; margin-bottom: 20px;">${subjectListHtml}</div>
      <div style="display:flex; gap:5px;">
        <input id="new-subject-input" class="swal2-input" placeholder="새 과목명" style="margin:0; height:40px; flex:1">
        <button type="button" id="add-subject-btn" class="swal2-confirm swal2-styled" style="margin:0; background-color:#3085d6">추가</button>
      </div>
    `,
    showConfirmButton: false, // 커스텀 버튼들을 사용할 것이므로 비활성화
    didRender: () => {
      // 선택 버튼
      document.querySelectorAll('.select-btn').forEach(btn => {
        btn.onclick = () => {
          const sub = subjects.find(s => String(s.id) === String(btn.dataset.id));

          if (sub) {
           console.log("선택된 과목 데이터:", sub); // 디버깅용 로그
         onSelect(sub); // 여기서 Main.js의 setSelectedSubject가 호출됩니다.
           Swal.close();
                   }
        else {
      console.error("과목을 찾을 수 없습니다. ID:", btn.dataset.id);
          //onSelect(sub);
          //Swal.close(); // 선택 후 팝업 닫기
        }
      }}
      );
      // 삭제 버튼
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = () => {
          onDelete(btn.dataset.id);
          Swal.close(); // 삭제 후 목록 갱신을 위해 닫기(다시 열어야 함)
        };
      });
      // 추가 버튼
      document.getElementById('add-subject-btn').onclick = () => {
        const val = document.getElementById('new-subject-input').value;
        if (val) {
          onAdd(val);
          Swal.close();
        }
      };
    }
  });
};

export const showBreakTimer = (minutes, onStopAlarm) => {
  let timeLeft = minutes * 60;
  let breakTimerInterval ;
  Swal.fire({
    title: '휴식 시간입니다!',
    showCloseButton: true,
    html: `
      <div id="break-timer-circle" style="
        width: 200px; height: 200px; border-radius: 50%; 
        border: 5px solid #4CAF50; margin: 20px auto;
        display: flex; align-items: center; justify-content: center;
        font-size: 30px; font-weight: bold;
      ">
        <span id="break-time-text">05:00</span>
      </div>
    `,
    didOpen: () => {
      const text = document.getElementById('break-time-text');
      breakTimerInterval = setInterval(() => {
        timeLeft--;
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        text.innerText = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
          clearInterval(breakTimerInterval);
          Swal.close();
        }
      }, 1000);

    },
    didClose: () => {
      // 팝업이 닫힐 때(X버튼 포함) 확실히 정리
      if (breakTimerInterval) {
        clearInterval(breakTimerInterval);
        breakTimerInterval = null;
      }
      if (onStopAlarm) onStopAlarm();
    },
    showConfirmButton: false,
    allowOutsideClick: false
  });
};