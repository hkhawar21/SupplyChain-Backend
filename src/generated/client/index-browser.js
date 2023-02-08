
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 3.15.2
 * Query Engine version: ceb5c99003b99c9ee2c1d2e618e359c14aef2ea5
 */
Prisma.prismaVersion = {
  client: "3.15.2",
  engine: "ceb5c99003b99c9ee2c1d2e618e359c14aef2ea5"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = () => (val) => val

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = 'DbNull'
Prisma.JsonNull = 'JsonNull'
Prisma.AnyNull = 'AnyNull'

/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }

exports.Prisma.UserScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  email: 'email',
  password: 'password',
  role: 'role'
});

exports.Prisma.VendorScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  contact: 'contact',
  address: 'address',
  price_per_unit: 'price_per_unit'
});

exports.Prisma.CustomerScalarFieldEnum = makeEnum({
  id: 'id',
  first_name: 'first_name',
  last_name: 'last_name',
  contact: 'contact'
});

exports.Prisma.OrderScalarFieldEnum = makeEnum({
  id: 'id',
  quantity: 'quantity',
  status: 'status',
  amount: 'amount',
  address: 'address'
});

exports.Prisma.ProductScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  price_per_unit: 'price_per_unit',
  status: 'status',
  image: 'image',
  weight: 'weight',
  category_name: 'category_name',
  category_id: 'category_id'
});

exports.Prisma.ProductOrderScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  quantity: 'quantity',
  price: 'price',
  product_id: 'product_id'
});

exports.Prisma.CategoryScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  status: 'status',
  image: 'image'
});

exports.Prisma.Raw_MaterialScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  quantity: 'quantity'
});

exports.Prisma.WarehouseScalarFieldEnum = makeEnum({
  id: 'id',
  address: 'address',
  contact: 'contact',
  email: 'email',
  phone_number: 'phone_number'
});

exports.Prisma.AgentScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name',
  address: 'address',
  phone_number: 'phone_number',
  city: 'city',
  status: 'status'
});

exports.Prisma.InventoryScalarFieldEnum = makeEnum({
  id: 'id',
  raw_material_id: 'raw_material_id',
  product_id: 'product_id'
});

exports.Prisma.SortOrder = makeEnum({
  asc: 'asc',
  desc: 'desc'
});

exports.Prisma.QueryMode = makeEnum({
  default: 'default',
  insensitive: 'insensitive'
});

exports.Prisma.UserOrderByRelevanceFieldEnum = makeEnum({
  name: 'name',
  email: 'email',
  password: 'password'
});

exports.Prisma.VendorOrderByRelevanceFieldEnum = makeEnum({
  name: 'name',
  contact: 'contact',
  address: 'address'
});

exports.Prisma.CustomerOrderByRelevanceFieldEnum = makeEnum({
  first_name: 'first_name',
  last_name: 'last_name',
  contact: 'contact'
});

exports.Prisma.OrderOrderByRelevanceFieldEnum = makeEnum({
  status: 'status',
  address: 'address'
});

exports.Prisma.ProductOrderByRelevanceFieldEnum = makeEnum({
  name: 'name',
  image: 'image',
  category_name: 'category_name'
});

exports.Prisma.ProductOrderOrderByRelevanceFieldEnum = makeEnum({
  name: 'name'
});

exports.Prisma.CategoryOrderByRelevanceFieldEnum = makeEnum({
  name: 'name',
  image: 'image'
});

exports.Prisma.Raw_MaterialOrderByRelevanceFieldEnum = makeEnum({
  name: 'name'
});

exports.Prisma.WarehouseOrderByRelevanceFieldEnum = makeEnum({
  address: 'address',
  contact: 'contact',
  email: 'email'
});

exports.Prisma.AgentOrderByRelevanceFieldEnum = makeEnum({
  name: 'name',
  address: 'address',
  phone_number: 'phone_number',
  city: 'city'
});
exports.AccessRole = makeEnum({
  finance: 'finance',
  orders: 'orders',
  products: 'products',
  customers: 'customers',
  agents: 'agents',
  warehouse: 'warehouse',
  inventory: 'inventory',
  admin: 'admin'
});

exports.Prisma.ModelName = makeEnum({
  User: 'User',
  Vendor: 'Vendor',
  Customer: 'Customer',
  Order: 'Order',
  Product: 'Product',
  ProductOrder: 'ProductOrder',
  Category: 'Category',
  Raw_Material: 'Raw_Material',
  Warehouse: 'Warehouse',
  Agent: 'Agent',
  Inventory: 'Inventory'
});

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
