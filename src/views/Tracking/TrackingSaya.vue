<template>
    <div class="py-4 container-fluid">
        <div class="row">
            <div class="pb-0 text-start">
                <h4 class="font-weight-bolder text-dark">Tracking Saya</h4>
            </div>
            <div class="p-4 col-lg-12">
                <div class="row">
                    <div class="col-lg-4 col-md-6 col-12 mb-3">
                        <card2 :title="stats.belum.title" :value="g$countStatus.progress"
                            :cardBackground="stats.belum.cardBackground"
                            :textPosition="stats.belum.textPosition" :iconPosition="stats.belum.iconPosition">
                        </card2>
                    </div>
                    <div class="col-lg-4 col-md-6 col-12 mb-3">
                        <card2 :title="stats.lewat.title" :value="g$countStatus.deadline"
                            :cardBackground="stats.lewat.cardBackground"
                            :textPosition="stats.lewat.textPosition" :iconPosition="stats.lewat.iconPosition">
                        </card2>
                    </div>
                    <div class="col-lg-4 col-md-6 col-12 mb-3">
                        <card2 :title="stats.selesai.title" :value="g$countStatus.done"
                            :cardBackground="stats.selesai.cardBackground"
                            :textPosition="stats.selesai.textPosition" :iconPosition="stats.selesai.iconPosition">
                        </card2>
                    </div>
                </div>
            </div>
            <div>
                <TrackingSayaTable />
            </div>
        </div>
    </div>
</template>
<script>
import Card2 from "@/examples/Cards/Card2.vue";
import TrackingSayaTable from "@/components/tables/TrackingSayaTable.vue";
import d$dashboard from '@/stores/dashboard/dashboard';
import { mapActions, mapState } from "pinia";

export default {
    name: "tracking-saya",
    data() {
        return {
            stats: {
                belum: {
                    title: "Belum Deadline",
                    cardBackground: "bg-primary",
                    textPosition: "p-3 ms-2 col-8",
                    iconPosition: "p-1 col-3 mt-2",
                },
                lewat: {
                    title: "Melewati Deadline",
                    cardBackground: "bg-danger",
                    textPosition: "p-3 ms-2 col-8",
                    iconPosition: "p-1 col-3 mt-2",
                },
                selesai: {
                    title: "Selesai",
                    cardBackground: "bg-success",
                    textPosition: "p-3 ms-2 col-8",
                    iconPosition: "p-1 col-3 mt-2",
                },
            },
            data: [],
        };
    },
    components: {
        Card2,
        TrackingSayaTable,
    },
    computed: {
        ...mapState(d$dashboard, ['g$countStatus']),
    },
    methods: {
        ...mapActions(d$dashboard, ['a$countStatus']),
    },
    async mounted() {
        try {
            await this.a$countStatus();
        } catch (e) {
        }
    }
};
</script>