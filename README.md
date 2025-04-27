PC:
khi clone về. bật terminal nó lên
Chạy "npm install" trước
Xong chạy "npm start", đợi 1 lúc sẽ có sẽ có mã QR giống v (Hình Minh Hoạ)
![image](https://github.com/user-attachments/assets/e70b5fb1-2524-4961-a490-e5016fa6322e)

Điện Thoại:
Trên đt lên chplay tải expo về
xong quét mã là đc (Hình Minh Hoạ)
![image](https://github.com/user-attachments/assets/ea4556fc-c216-44ce-afc6-d1ccf744f630)

Gắn API BE: vào src/allScreens/api/config.js
thay BE_URL bằng link BE vào: (Hình Minh Hoạ)
![image](https://github.com/user-attachments/assets/22b1f60a-511d-4c05-a62f-5a9370307dee)


Lưu ý: cả 2 máy phải kết nối 1 mạng 

*** Sử dụng NGROK để deploy BE. ***
1.  khởi động BE. '127.0.0.1:5000'
2.  vào web https://ngrok.com/ tạo 1 tài khoản.
3.  sau khi tạo xong thì vào https://dashboard.ngrok.com/get-started/setup/windows tải file ngrok về
  
   ![image](https://github.com/user-attachments/assets/b2d6b034-3b85-496a-a4d1-e75c55597830)

5.  giải nén ra, vào terminal của ngrok.
   ![image](https://github.com/user-attachments/assets/10874efb-5775-4da3-9d57-003c57d9f62b)
![image](https://github.com/user-attachments/assets/be812fa0-94bd-4953-8c4c-c6ec17400cc6)
6.  copy token vào terminal
![image](https://github.com/user-attachments/assets/747185a0-3b85-4608-b4b5-ef6af3021399)
7.  thành công:![image](https://github.com/user-attachments/assets/ee5dbe64-271f-4653-93ce-6d5a9fcdeb13)
8.  sử dụng lệnh để khởi chạy BE: ngrok http 5000
9.  hiện như vậy ta đã deploy thành công.
10. ![image](https://github.com/user-attachments/assets/6b184d3a-26ec-4f80-ac39-4fa2ee37abcc)
copy 'https://0334-2405-4802-8151-df90-6df0-2c0b-5b71-b4eb.ngrok-free.app' bỏ vào 'BE_URL' ở config.js
![image](https://github.com/user-attachments/assets/2bad3a56-033d-4bdf-aa28-07eee3095091)

Lưu ý: Mỗi khi tắt cmd đều phải làm lại từ bước số 8. Vì nó không phải mặc định 1 link
 

*** Thư viện ngoài hỗ trợ: ffmpeg (ép buộc phải có để có thể sử dụng VoiceScreen) ***
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
