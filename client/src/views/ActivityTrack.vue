<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="headline">Activity Track</span>
        <v-spacer></v-spacer>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" persistent max-width="600px">
          <!-- <v-btn slot="activator" color="primary" dark>Create New User</v-btn> -->
          <v-card>
            <v-card-title>
              <span class="headline">{{ form_title }}</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-text-field label="Order ID" v-model="form_data.order_id" disabled required></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-select :items="activities" v-model="form_data.activity_id" item-text="activity_name" 
                      item-value="activity_id" label="Activity ID" required></v-select>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="closeDialog">Close</v-btn>
              <v-btn color="blue darken-1" flat @click="createActivTracker">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-title>
      <v-data-table :headers="headers" :items="activity_trackers" :search="search">
        <template slot="items" slot-scope="props">
          <td class="text-xs-left">{{ props.item.activity_track_id }}</td>
          <td class="text-xs-left">{{ props.item.activity_name }}</td>
          <td class="text-xs-left">{{ props.item.order_id }}</td>
          <td><v-icon
            small
            class="mr-2"
            @click="editItem(props.item)"
          >
            edit
          </v-icon></td>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import axios from '@/services/service.api.js';

  export default {
    data() {
      return {
        dialog: false,
        form_data: {
          activity_id: '', 
          order_id: '',
        },
        form_index: -1,
        search: '',
        headers: [{
            text: 'Activity Track ID',
            value: 'activity_track_id'
          },
          {
            text: 'Activity Name',
            value: 'activity_name'
          },
          {
            text: 'Order ID',
            value: 'order_id'
          },
          {
            text: 'action'
          }
        ],
        activity_trackers: [],
        activities:[]
      }
    }, 
    methods: {
      // handle if user is not authenticated
      async initialize() {
        return axios.get('activity-trackers')
          .then(result => this.activity_trackers = result.data);
      }, 
      // handle if user is not authenticated
      async getActivities() {
        return axios.get('activities')
          .then(result => this.activities = result.data);
      }, 
      async createActivTracker() {
        if (this.form_index > -1) {
          return axios.put('current-activity/' + this.form_data.order_id + '/' + this.form_data.activity_id)
            .then((result) => {
              if (result.data.success) {
                this.dialog = false;
                window.alert('data berhasil diganti');
              }
            }).catch((error) => console.log(error));
        } else {
          this.dialog = false;
        }
      }, 
      editItem(item) {
        this.form_index = this.activity_trackers.indexOf(item);
        this.form_data = Object.assign({}, item);
        this.dialog = true;
      },
      closeDialog () {
        this.dialog = false
        setTimeout(() => {
          this.form_data = Object.assign({}, {})
          this.form_index = -1
        }, 300)
      },
    }, 
    created() {
      this.initialize();
      this.getActivities();
    }, 
    computed: {
      form_title() {
        return this.form_index > -1 ? 'Edit Activity Track' : 'New Activity Track';
      }
    }
  }
</script>
