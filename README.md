PC:
khi clone về. bật terminal nó lên
Chạy "npm install" trước
Xong chạy "npm start", đợi 1 lúc sẽ có sẽ có mã QR giống v
![image](https://github.com/user-attachments/assets/e70b5fb1-2524-4961-a490-e5016fa6322e)

Điện Thoại:
Trên đt lên chplay tải expo về
xong quét mã là đc
![image](https://github.com/user-attachments/assets/ea4556fc-c216-44ce-afc6-d1ccf744f630)


Lưu ý: cả 2 máy phải kết nối 1 mạng 

Thư viện ngoài hỗ trợ: ffmpeg (ép buộc phải có để có thể sử dụng VoiceScreen) 

Link Download:  https://drive.google.com/file/d/13xnxlPbqDNb1C-Y0q29GIbxHDlBdZBZV/view?usp=sharing 

Hướng Dẫn Sửa Dụng: 
1. Giải nén file zip của ffmpeg ra (ví dụ ra thành thư mục C:\ffmpeg). 
  → Bên trong phải có bin/ffmpeg.exe, bin/ffprobe.exe,...

2. Copy đường dẫn đến thư mục bin: 
  Ví dụ: C:\ffmpeg\bin

3. Mở Settings của Windows:
   Cách 1:
  Bấm phím Windows → tìm "Environment Variables" (hoặc "Biến môi trường").

  Cách 2:
  Chuột phải This PC  
  (Máy tính này) → Properties. 
  Chọn Advanced  
  system settings. 
  Bấm Environment Variables. 

4. Ở mục System variables, tìm dòng Path → chọn → bấm Edit.... 

5. Ở cửa sổ Path: 
  Bấm New. 
  Paste đường dẫn  
  C:\ffmpeg\bin vào. 

6. Bấm OK liên tục để lưu lại. 

7. Restart lại Terminal / cmd nếu đang mở sẵn. 
