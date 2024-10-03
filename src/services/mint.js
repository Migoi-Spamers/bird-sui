import axios from "axios";
import colors from "colors";

class MintService {
    constructor() {
    }

    async checkMintStatus(user) {
        try {
            const response = await user.http.get(2, `worms/mint-status`);
            const data = response.data;

            if (data.message === "SUCCESS" && data.data.status === "MINT_OPEN") {
                return true;
            } else {
                user.log.log(`Bắt sâu sau: ${colors.blue((new Date(data.data.nextMintTime).getTime() - Date.now()) / 1000)} giây`);
                return false;
            }
        } catch (error) {
            user.log.logError(`Lỗi khi lấy trạng thái sâu: ${error.message}`);
            return false;
        }
    }

    async mint(user) {
        try {
            const response = await user.http.post(2, `worms/mint`, {});
            const data = response.data;

            if (data.message === "MISSED") {
                user.log.log("Bắt sâu trượt thử lại sau");
            } else if (data.message === 'SUCCESS') {
                user.log.log(`Bắt sâu thành công: loại ${colors.green(data.minted.type)}, thưởng ${colors.green(data.minted.reward)}`);
            }
        } catch (error) {
            user.log.logError(`Lỗi khi cố bắt sâu: ${error.message}`);
        }
    }

    async handleMint(user) {
        const canMint = await this.checkMintStatus(user);

        if (canMint) {
            await this.mint(user);
        }
    }
}


const mintService = new MintService();
export default mintService;
