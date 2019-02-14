const UserController = require('../controllers/controller.user.js');
const ActivitiyController = require('../controllers/controller.activity');
const ActivConnController = require('../controllers/controller.activity_connections');
const RoleController = require('../controllers/controller.role.js');
const ActivOptController = require('../controllers/controller.activity_options.js');
const OrderController = require('../controllers/controller.order.js');
const STOOfficeController = require('../controllers/controller.sto_office.js');
const OrderHistory = require('../controllers/controller.order_history.js');
const ActivityTracker = require('../controllers/controller.activity_tracker.js');
const OrderVendorHistory = require('../controllers/controller.order_vendor.js');
const attachmentController = require('../controllers/controller.attachment.js');

const jwt = require('jsonwebtoken');

// check user's role is admin
function checkIfAdmin(req, res, next) {
  if (req.decoded.payload.role_id === 1) {
    next();
  } else {
    return res.status(401).send({
      success: false, 
      message: 'you are not authorized to access this URI'
    });
  }
}

module.exports = (router) => {
  router.get('/', (req, res) => res.send('Hello World'));
  router.post('/token', UserController.authenticateUser);
  router.post('/uploads/:orderLogsId', attachmentController.uploadFiles);
  router.get('/download/:attachmentId', attachmentController.downloadFile);

  // authenticate user
  router.use((req, res, next) => {
    const header = req.headers['authorization'];
    if (typeof header !== 'undefined') {
      const bearer = header.split(' ');
      const token = bearer[1];
      req.token = token;
    }
    const token = req.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, 'koderahasia', (err, decoded) => {
        if (err) return res.json({success: false, message: 'auth failed'});
        req.decoded = decoded;
        next();
      });
    } else {  
      return res.status(403).send({
        success: false, 
        message: 'No token provided'
      });
    }
  });

  // role route
  router.get('/roles', RoleController.selectAllRoles);
  router.post('/roles/add', RoleController.createNewRole);
  router.delete('/roles/:roleId', RoleController.deleteRole);

  router.get('/vendors', UserController.getVendors);

  // user routes
  router.get('/users', UserController.getAllUsers);
  router.get('/user/:userId', UserController.selectUser);
  router.post('/user/add', checkIfAdmin, UserController.addnewUser);
  router.delete('/user/:userId', checkIfAdmin, UserController.deleteUser);

  // get data sto 
  router.get('/offices', STOOfficeController.getAllOffice);

  // activity routes
  router.get('/activities', ActivitiyController.getAllActivity);
  router.post('/activity/add', checkIfAdmin, ActivitiyController.createNewActivity);
  router.get('/activity/:activityId', ActivitiyController.getActivityById);
  router.delete('/activity/:activityId', checkIfAdmin, ActivitiyController.deleteActivity);

  // activity relations routes
  router.get('/activity-step/all', ActivConnController.getAllConnection);
  router.get('/activity-step/:activityId/:optionValue', ActivConnController.getNextStep);
  router.post('/activity-step', checkIfAdmin, ActivConnController.createConnection);
  router.delete('/activity-step/:activityConnId', checkIfAdmin, ActivConnController.deleteConnection);

  // options per activity routes
  router.get('/activity-options/all', ActivOptController.getAllActivityOptions);
  router.get('/activity-options/:activityId', ActivOptController.getActivityOptionsById);
  router.post('/activity-options', ActivOptController.createActivityOption);
  router.delete('/activity-options/:activityOptId', ActivOptController.deleteActivity);

  router.get('/orders', OrderController.getAllOrder);
  router.put('/order/:orderId/close', OrderController.closeOrder);
  router.get('/order/:orderId', OrderController.getOrderById);
  router.post('/orders/add', OrderController.createNewOrder);
  router.delete('/order/:orderId', OrderController.deleteOrder);

  router.get('/order-history/all', OrderHistory.getAllOrderHistory);
  router.get('/order-history/:orderId', OrderHistory.getAllOrderHistoryPerId);
  router.post('/order-history/post', OrderHistory.createNewOrderLog);
  router.delete('/order-history/:orderLogId', OrderHistory.deleteOrderLog);
  
  router.post('/order-vendor', OrderVendorHistory.addNewOrderVendor);
  router.get('/order-vendor/:orderId', OrderVendorHistory.getOrderVendor);

  router.get('/current-activity/:orderId', ActivityTracker.getCurrentActivity);
  router.put('/current-activity/:activityId', ActivityTracker.updateActivity);

}