import { Router } from "express";
import RoomManager from "../../class/RoomManager";
import UserManager from "../../class/UserManager";
import { ERROR_CODES } from "../../utils/constants";
import { apiError } from "../../utils/functions";
import { ApiRequest, ApiResponse } from "../../utils/type";
import { GetChatSuccess } from "./type";

const router = Router();

// User join room
router.post('/:roomId', (
  req: ApiRequest<{ userId: string }, { roomId: string }>,
  res: ApiResponse<GetChatSuccess>,
) => {
  const { userId } = req.body;
  const { roomId } = req.params;

  if (UserManager.getById(userId)) {
    const room = RoomManager.getRoom(roomId);
    if (room) {
      res.json({
        status: 'success',
        data: {
          conversations: room.conversation
        }
      })
    } else {
      res.status(400).json({
        status: 'error',
        error: apiError(ERROR_CODES.ROOM_NOT_EXIST),
      });
    }
  } else {
    res.status(400).json({
      status: 'error',
      error: apiError(ERROR_CODES.USER_NOT_EXIST),
    });
  }
});



export default router;
