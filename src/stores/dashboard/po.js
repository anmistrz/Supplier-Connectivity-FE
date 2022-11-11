import { defineStore } from 'pinia';
import * as s$po from '@/services/dashboard/po';

const d$po = defineStore({
    id: 'po',
    state: () => ({
        list_po: [],
        list_my_po: [],
        list_inbox: [],
        list_po_detail: [],
        list_po_terdekat: [],
        list_po_selesai_terbaru: [],
        get_po_detail: {},
        po: {},
        detail: {},
        status: null,
    }),
    actions: {
        async a$listAllPo(options) {
            try {
                this.status = null;
                const { data, status } = await s$po.listAllPo(options);
                this.list_po = data ?? [];
                this.status = status;
            } catch ({ error, message }) {
                this.status = false;
                throw error ?? message;
            }
        },
        async a$listMyPo(options) {
            try {
                this.status = null;
                const { data, status } = await s$po.listMyPo(options);
                this.list_my_po = data ?? [];
                this.status = status;
            } catch ({ error, message }) {
                this.status = false;
                throw error ?? message;
            }
        },
        async a$listInbox(options) {
            try {
                this.status = null;
                const { data, status } = await s$po.listInbox(options);
                this.list_inbox = data ?? [];
                this.status = status;
            } catch ({ error, message }) {
                this.status = false;
                throw error ?? message;
            }
        },
        async a$getPoDetail(options) {
            try {
                this.status = null;
                const { data, status } = await s$po.getPoDetail(options);
                this.get_po_detail = data ?? {};
                this.status = status;
            } catch ({ error, message }) {
                this.status = false;
                throw error ?? message;
            }
        },
        async a$listPoDetail(options) {
            try {
                this.status = null;
                const { data, status } = await s$po.listPoDetail(options);
                this.po = data.po ?? {};
                this.list_po_detail = data.list ?? [];
                this.status = status;
            } catch ({ error, message }) {
                this.status = false;
                throw error ?? message;
            }
        },

        async a$addPo(body) {
            try {
                await s$po.addPo(body);
            } catch ({ error, message }) {
                throw error ?? message;
            }
        },
        async a$inquiryDetail(id) {
            try {
                this.detail = {};
                if (!id) return;
                const { data } = await s$po.detail(id);
                this.detail = data;
            } catch ({ error, message }) {
                this.detail = {};
                throw error ?? message;
            }
        },
        async a$editPoDetail(id, body) {
            try {
                await s$po.editPoDetail(id, body);
            } catch ({ error, message }) {
                throw error ?? message;
            }
        },
    },
    getters: {
        g$status: ({ status }) => status,
        g$po: ({ po }) => po,
        g$list_po_detail: ({ list_po_detail }) => list_po_detail,
        g$list_po: ({ list_po }) => list_po, //list all po
        g$list_inbox: ({ list_inbox }) => list_inbox,
        g$list_my_po: ({ list_my_po }) => list_my_po,
        g$get_po_detail: ({ get_po_detail }) => get_po_detail,
        g$list_po_terdekat: ({ list_my_po }) => list_my_po.filter((item) => item.day_count < 7),
        g$list_po_selesai_terbaru: ({ list_my_po }) => list_my_po.filter((item) => item.day_count < 7 && item.status == 1),
        g$detail: ({ detail }) => detail,
    },
});

export default d$po;