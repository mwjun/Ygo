<table id="list-table">
    <thead>
        <tr>
            <?php if ($stype == 'ots'): ?>
                <td>Location</td>
                <td>Address</td>
                <td>City</td>
                <td>State</td>
                <td>Zip</td>
                <td>Phone</td>
                <td>Schedule</td>
                <td>Duel terminal</td>
            <?php elseif ($stype == 'rts'): ?>
                <td>Location</td>
                <td>Host</td>
                <td>Address</td>
                <td>City</td>
                <td>State</td>
                <td>Zip</td>
                <td>Phone</td>
                <td>Capacity</td>
                <td>Date</td>
                <td>Time</td>
            <?php endif; ?>
        </tr>
    </thead>
    <tbody>
        <?php foreach($locations as $location): ?>
            <tr>
            <?php if ($stype == 'ots'): ?>
                <td>{{$location['location']}}</td>
                <td>{{$location['address']}}</td>
                <td>{{$location['city']}}</td>
                <td>{{$location['state']}}</td>
                <td>{{$location['zip']}}</td>
                <td>{{$location['phone']}}</td>
                <td>{{$location['schedule']}}</td>
                <td>{{($location['duel_terminal']) ? 'yes' : 'no'}}</td>
            <?php elseif ($stype == 'rts'): ?>
                <td>{{$location['location']}}</td>
                <td>{{$location['host']}}</td>
                <td>{{$location['address']}}</td>
                <td>{{$location['city']}}</td>
                <td>{{$location['state']}}</td>
                <td>{{$location['zip']}}</td>
                <td>{{$location['phone']}}</td>
                <td>{{$location['cap']}}</td>
                <td>{{$location['date']}}</td>
                <td>{{$location['time']}}</td>
            <?php endif; ?>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>
