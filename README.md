# Tool Auto Vana NodeJS by JeffJack

**Tool phát triển và chia sẻ miễn phí bởi ZuyDD**

> [!WARNING]
> Mọi hành vi buôn bán tool dưới bất cứ hình thức nào đều không được cho phép!

## 🛠️ Hướng dẫn cài đặt

> Yêu cầu đã cài đặt NodeJS

- Bước 1: Tải về phiên bản mới nhất của tool
- Bước 2: Giải nén tool
- Bước 3: Tại thư mục tool vừa giải nén (thư mục có chứa file package.json), chạy lệnh `npm install` để cài đặt các thư viện bổ trợ

## 💾 Cách thêm dữ liệu tài khoản

> Tool hỗ trợ cả `user` và `query_id` (khuyến khích dùng query_id)

> Tất cả dữ liệu mà bạn cần nhập đều nằm ở các file trong thư mục 📁 `src / data`

- [users.txt](src/data/users.txt) : chứa danh sách `user` hoặc `query_id` của các tài khoản, mỗi dòng ứng với một tài khoản
- [proxy.txt](src/data/proxy.txt) : chứa danh sách proxy, proxy ở mỗi dòng sẽ ứng với tài khoản ở dòng đó trong file users.txt phía trên, để trống nếu không dùng proxy
- [token.json](src/data/token.json) : chứa danh sách token được tạo ra từ `user` hoặc `query_id`. Token sẽ được tự động sinh ra khi bạn chạy tool

> Định dạng proxy: http://user:pass@ip:port

## >\_ Các lệnh và chức năng tương ứng

| Lệnh            | Chức năng                                                                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run start` | Dùng để chạy farming/claim, làm nhiệm vụ, điểm danh, chơi game, claim điểm invite,.... tóm lại game có gì là nó làm cái đó |

## 🕹️ Các tính năng có trong tool

- tự động farming 20s
- tự động chơi game
- nhận diện proxy tự động, tự động kết nối lại proxy khi bị lỗi. ae ai chạy proxy thì thêm vào file proxy.txt ở dòng ứng với dòng chứa acc muốn chạy proxy đó, acc nào không muốn chạy proxy thì để trống hoặc gõ skip vào
- đa luồng chạy bao nhiêu acc cũng được, không bị block lẫn nhau
- Mặc định ở vòng lặp đầu tiên mỗi tài khoản (luồng) sẽ chạy cách nhau 30s để tránh spam request, có thể tìm biến `DELAY_ACC = 30` trong file [index.js](src/run/index.js) để điều chỉnh cho phù hợp

> [!WARNING]
> - Nếu gặp lỗi đăng nhập, làm nhiệm vụ hay chơi game thì là do server của blum nó lỏ chứ không phải lỗi tool, cứ kệ nó, hồi nó quay lại làm sau khi hết lỗi.
> - Vì server nó hay lỗi vào khung giờ 14h-24h nên khuyến khích ae chạy tool lần đầu vào khung giờ 4h-12h để chạy mượt mà nhé
## 🔄 Lịch sử cập nhật

> Phiên bản mới nhất: `v0.0.1`

<details>
<summary>v0.0.1 - 📅 02/09/2024</summary>
  
- Điều chỉnh điểm point chơi game về đúng với thực tế (từ 180 - 200)
</details>
<details>
<summary>v0.0.1 - 📅 19/09/2024</summary>
  
- Chia sẽ tool đến cộng đồng
</details>
