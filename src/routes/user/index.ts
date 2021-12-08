import { Router } from "express";
import MQTTService from "../../class/MQTTService";
import UserManager from "../../class/UserManager";
import { ERROR_CODES, LOBBY_TOPIC } from "../../utils/constants";
import { apiError } from "../../utils/functions";
import { ApiRequest, ApiResponse, MQTTMessageTypes } from "../../utils/type";
import { GetUsersResponse, RegisterSuccess, RegisterUserBody } from "./type";

const router = Router();

// Get all users
router.get('/', (
  req: ApiRequest<any>,
  res: ApiResponse<GetUsersResponse>
) => {
  res.json({
    status: 'success',
    data: {
      users: UserManager.getUsers(),
    }
  });
})

router.post('/', (
  req: ApiRequest<RegisterUserBody>,
  res: ApiResponse<RegisterSuccess>
) => {
  const { name } = req.body;
  if (UserManager.checkUserExist(name)) {
    return res.status(400).json({
      status: 'error',
      error: apiError(ERROR_CODES.NAME_TAKEN),
    });
  } else {
    const user = UserManager.addUser(name);
    MQTTService.pub(LOBBY_TOPIC, {
      type: MQTTMessageTypes.NOTIFICATION,
      payload: {
        message: `Welcome ${name} to lobby`
      }
    });
    res.json({
      status: 'success',
      data: {
        userId: user?.id || '',
      }
    })
  }
})



export default router;
