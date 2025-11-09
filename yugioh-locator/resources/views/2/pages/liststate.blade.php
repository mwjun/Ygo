<option value="" selected="true" disabled="disabled">-- Choose a State --</option>
<?php foreach($states as $state): ?>
    <option value="{{$state['state']}}">{{$state['state']}}</option>
<?php endforeach; ?>

