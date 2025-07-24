// Export all customer actions
export {
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomer,
  getAllCustomers,
  toggleCustomerStatus,
} from "./customer-actions";

// Export all ticket actions
export {
  createTicket,
  updateTicket,
  deleteTicket,
  getTicket,
  getAllTickets,
  getTicketsByCustomer,
  assignTicket,
  toggleTicketStatus,
} from "./ticket-actions";

// Export action client and types
export { action } from "../safe-actions";
export type { ActionResponse, ActionSuccess } from "../safe-actions"; 