import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
import {
    RawMaterialStatus,
    OrderStatus,
    RawMaterial,
} from "@generated/type-graphql";

const prisma = new PrismaClient();

const seedDatabase = async () => {
    // Create users
    await prisma.user.deleteMany();

    const user1 = await prisma.user.create({
        data: {
            name: "John Doe",
            email: "john.doe@example.com",
            password: "password",
            role: { set: ["orders", "customers"] },
        },
    });

    const user2 = await prisma.user.create({
        data: {
            name: "Jane Smith",
            email: "jane.smith@example.com",
            password: "password",
            role: { set: ["finance"] },
        },
    });

    const user3 = await prisma.user.create({
        data: {
            name: "Robert Johnson",
            email: "robert.johnson@example.com",
            password: "password",
            role: { set: ["warehouse", "inventory"] },
        },
    });

    // Create an inventory for one time only
    // const inventory = await prisma.inventory.create({
    //     data: {},
    // });

    // Create customers
    const customers = [
        {
            first_name: "Alice",
            last_name: "Smith",
            contact: "alice.smith@example.com",
        },
        {
            first_name: "Michael",
            last_name: "Brown",
            contact: "michael.brown@example.com",
        },

        {
            first_name: "Michelle",
            last_name: "Johnson",
            contact: "555-6789",
        },
        {
            first_name: "Robert",
            last_name: "Smith",
            contact: "555-2345",
        },
        {
            first_name: "Jennifer",
            last_name: "Brown",
            contact: "555-8901",
        },
    ];

    const createdCustomers = await prisma.customer.createMany({
        data: customers,
        skipDuplicates: true,
    });

    const category = await prisma.category.create({
        data: {
            name: "Steel",
            status: true,
            image: "",
        },
    });

    // Create raw materials
    const rawMaterials = [
        {
            name: "Iron Ore",
            price: 10.99,
            status: true,
            inventory_id: 1,
            requested: 0,
            presentInInventory: 500,
            requestedStatus: RawMaterialStatus.PENDING,
        },
        {
            name: "Coal",
            price: 8.99,
            status: true,
            inventory_id: 1,
            requested: 0,
            presentInInventory: 400,
            requestedStatus: RawMaterialStatus.PENDING,
        },
        {
            name: "Limestone",
            price: 6.99,
            status: true,
            inventory_id: 1,
            requested: 0,
            presentInInventory: 300,
            requestedStatus: RawMaterialStatus.PENDING,
        },
        {
            name: "Manganese",
            price: 12.99,
            status: true,
            inventory_id: 1,
            requested: 0,
            presentInInventory: 200,
            requestedStatus: RawMaterialStatus.PENDING,
        },
    ];

    const createdRawMaterials = await prisma.rawMaterial.createMany({
        data: rawMaterials,
        skipDuplicates: true,
    });

    // Create products
    const products = [
        {
            name: "Steel Plate",
            price_per_unit: 19.99,
            status: true,
            weight: 10.5,
            time: "2 days",
            presentInInventory: 100,
            category_id: 1,
        },
        {
            name: "Steel Rod",
            price_per_unit: 14.99,
            status: true,
            weight: 5.2,
            time: "3 days",
            presentInInventory: 50,
            category_id: 1,
        },
        {
            name: "Steel Sheet",
            price_per_unit: 29.99,
            status: true,
            image: "steel_sheet.jpg",
            weight: 8.5,
            time: "2 days",
            presentInInventory: 75,
            category_id: 1,
        },
        {
            name: "Steel Wire",
            price_per_unit: 9.99,
            status: true,
            image: "steel_wire.jpg",
            weight: 2.3,
            time: "1 day",
            presentInInventory: 100,
            category_id: 1,
        },
        {
            name: "Steel Tube",
            price_per_unit: 14.99,
            status: true,
            image: "steel_tube.jpg",
            weight: 4.8,
            time: "3 days",
            presentInInventory: 60,
            category_id: 1,
        },
        {
            name: "Steel Pipe",
            price_per_unit: 19.99,
            status: true,
            image: "steel_pipe.jpg",
            weight: 3.7,
            time: "2 days",
            presentInInventory: 80,
            category_id: 1,
        },
        {
            name: "Steel Beam",
            price_per_unit: 24.99,
            status: true,
            image: "steel_beam.jpg",
            weight: 12.6,
            time: "4 days",
            presentInInventory: 40,
            category_id: 1,
        },
    ];

    const createdProducts = await prisma.product.createMany({
        data: products,
        skipDuplicates: true,
    });

    // Create product raw materials
    const productRawMaterials = [
        // Product raw materials for Steel Plate
        {
            raw_material_id: 5, // Iron Ore
            product_id: 10, // Steel Plate
            quantity: 3,
        },
        {
            raw_material_id: 6, // Coal
            product_id: 10, // Steel Plate
            quantity: 2,
        },
        {
            raw_material_id: 7, // Limestone
            product_id: 10, // Steel Plate
            quantity: 1,
        },

        // Product raw materials for Steel Rod
        {
            raw_material_id: 5, // Iron Ore
            product_id: 13, // Steel Rod
            quantity: 1,
        },
        {
            raw_material_id: 6, // Coal
            product_id: 13, // Steel Rod
            quantity: 1,
        },
        {
            raw_material_id: 8, // Manganese
            product_id: 13, // Steel Rod
            quantity: 1,
        },
        // Product raw materials for Steel Sheet
        {
            raw_material_id: 5, // Iron Ore
            product_id: 9, // Steel Sheet
            quantity: 2,
        },
        {
            raw_material_id: 6, // Coal
            product_id: 9, // Steel Sheet
            quantity: 1,
        },
        {
            raw_material_id: 7, // Limestone
            product_id: 9, // Steel Sheet
            quantity: 1,
        },

        // Product raw materials for Steel Wire
        {
            raw_material_id: 5, // Iron Ore
            product_id: 11, // Steel Wire
            quantity: 1,
        },
        {
            raw_material_id: 6, // Coal
            product_id: 11, // Steel Wire
            quantity: 1,
        },

        // Product raw materials for Steel Tube
        {
            raw_material_id: 5, // Iron Ore
            product_id: 14, // Steel Tube
            quantity: 3,
        },
        {
            raw_material_id: 6, // Coal
            product_id: 14, // Steel Tube
            quantity: 2,
        },
        {
            raw_material_id: 7, // Limestone
            product_id: 14, // Steel Tube
            quantity: 1,
        },

        // Product raw materials for Steel Pipe
        {
            raw_material_id: 5, // Iron Ore
            product_id: 13, // Steel Pipe
            quantity: 2,
        },
        {
            raw_material_id: 6, // Coal
            product_id: 13, // Steel Pipe
            quantity: 1,
        },
        {
            raw_material_id: 8, // Manganese
            product_id: 13, // Steel Pipe
            quantity: 1,
        },

        // Product raw materials for Steel Beam
        {
            raw_material_id: 5, // Iron Ore
            product_id: 8, // Steel Beam
            quantity: 4,
        },
        {
            raw_material_id: 6, // Coal
            product_id: 8, // Steel Beam
            quantity: 3,
        },
        {
            raw_material_id: 7, // Limestone
            product_id: 8, // Steel Beam
            quantity: 2,
        },
        {
            raw_material_id: 8, // Manganese
            product_id: 8, // Steel Beam
            quantity: 1,
        },
    ];

    const createdProductRawMaterials =
        await prisma.productRawMaterials.createMany({
            data: productRawMaterials,
            skipDuplicates: true,
        });

    // Create orders
    const orders = [
        {
            quantity: 5,
            status: OrderStatus.PENDING,
            amount: 54.95,
            address: "123 Oak Street",
            customer_id: 1,
            inventory_id: 1,
        },

        {
            quantity: 3,
            status: OrderStatus.PENDING,
            amount: 39.99,
            address: "789 Maple Avenue",
            customer_id: 1,
            inventory_id: 1,
        },
        {
            quantity: 4,
            status: OrderStatus.PROCESSING,
            amount: 79.96,
            address: "321 Cedar Street",
            customer_id: 1,
            inventory_id: 1,
        },
        {
            quantity: 1,
            status: OrderStatus.PENDING,
            amount: 9.99,
            address: "456 Elm Avenue",
            customer_id: 1,
            inventory_id: 1,
        },
        {
            quantity: 5,
            status: OrderStatus.DELIVERED,
            amount: 74.95,
            address: "123 Oak Road",
            customer_id: 1,
            inventory_id: 1,
        },
        {
            quantity: 2,
            status: OrderStatus.PENDING,
            amount: 29.98,
            address: "789 Pine Road",
            customer_id: 1,
            inventory_id: 1,
        },
    ];

    const createdOrders = await prisma.order.createMany({
        data: orders,
        skipDuplicates: true,
    });

    // Create product orders
    const productOrders = [
        // Product orders for the first order
        {
            name: "Steel Sheet",
            quantity: 2,
            price: 29.99,
            product_id: 9,
            order_id: 3,
        },
        {
            name: "Steel Wire",
            quantity: 2,
            price: 9.99,
            product_id: 11,
            order_id: 3,
        },

        // Product orders for the second order
        {
            name: "Steel Sheet",
            quantity: 1,
            price: 29.99,
            product_id: 9,
            order_id: 6,
        },
        {
            name: "Steel Wire",
            quantity: 1,
            price: 9.99,
            product_id: 11,
            order_id: 6,
        },

        // Product orders for the third order
        {
            name: "Steel Tube",
            quantity: 1,
            price: 9.99,
            product_id: 14,
            order_id: 4,
        },

        // Product orders for the fourth order
        {
            name: "Steel Plate",
            quantity: 3,
            price: 19.99,
            product_id: 10,
            order_id: 1,
        },
        {
            name: "Steel Rod",
            quantity: 2,
            price: 14.99,
            product_id: 11,
            order_id: 1,
        },

        // Product orders for the fifth order
        {
            name: "Steel Plate",
            quantity: 3,
            price: 19.99,
            product_id: 10,
            order_id: 5,
        },
        {
            name: "Steel Rod",
            quantity: 2,
            price: 14.99,
            product_id: 11,
            order_id: 5,
        },

        // Product orders for the sixth order
        {
            name: "Steel Beam",
            quantity: 2,
            price: 24.99,
            product_id: 8,
            order_id: 2,
        },
        {
            name: "Steel Pipe",
            quantity: 1,
            price: 14.99,
            product_id: 13,
            order_id: 2,
        },
    ];

    const createdProductOrders = await prisma.productOrder.createMany({
        data: productOrders,
        skipDuplicates: true,
    });

    // Create agents
    const agents = [
        {
            name: "John Anderson",
            address: "789 Pine Street",
            phone_number: "555-1234",
            city: "New York",
            status: true,
        },
        {
            name: "Sarah Thompson",
            address: "456 Oak Avenue",
            phone_number: "555-5678",
            city: "Chicago",
            status: true,
        },
        {
            name: "Michael Davis",
            address: "321 Elm Road",
            phone_number: "555-9012",
            city: "Los Angeles",
            status: true,
        },
        {
            name: "Emily Wilson",
            address: "789 Maple Lane",
            phone_number: "555-3456",
            city: "Houston",
            status: true,
        },
        {
            name: "David Roberts",
            address: "123 Cedar Drive",
            phone_number: "555-7890",
            city: "Dallas",
            status: true,
        },
    ];

    const createdAgents = await prisma.agent.createMany({
        data: agents,
        skipDuplicates: true,
    });
};

seedDatabase();
