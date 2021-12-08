import { Router } from "express";
import RoomManager from "../../class/RoomManager";
import { ERROR_CODES } from "../../utils/constants";
import { apiError } from "../../utils/functions";
import { ApiRequest, ApiResponse, MemberRole } from "../../utils/type";
import { JoinRoomBody, JoinRoomSuccess } from "./type";

const router = Router();

// User join room
router.post('/:roomId', (
  req: ApiRequest<JoinRoomBody, { roomId: string }>,
  res: ApiResponse<JoinRoomSuccess>,
) => {
  const { accessCode, userId, role } = req.body;
  const { roomId } = req.params;

  // Check room existed:
  const room = RoomManager.getRoom(roomId);
  if (!room) {
    return res.status(400).json({
      status: 'error',
      error: apiError(ERROR_CODES.ROOM_NOT_EXIST)
    });
  }

  // Check user exist in room
  if (room.checkUserExist(userId)) {
    return res.status(400).json({
      status: 'error',
      error: apiError(ERROR_CODES.USER_ALREADY_IN_ROOM)
    });
  }

  // Join room
  RoomManager.join(userId, role, roomId, accessCode).then(() => {
    const room = RoomManager.getRoom(roomId);
    return res.json({
      status: 'success',
      data: {
        users: room ? room.getUsersInfo() : [],
        topics: room?.topics || null,
      }
    })
  }).catch((errorCode: ERROR_CODES) => {
    return res.status(400).json({
      status: "error",
      error: apiError(errorCode),
    })
  });
});



export default router;
