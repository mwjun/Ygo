<?php foreach($countries as $country): ?>
    <label><input type="radio" class="country" name="country" value="{{ $country['country'] }}" <?php if ($country['country'] == 'United States' || $country['country'] == 'USA') echo 'checked="checked"'; ?>>{{$country['country']}}</label><br>
<?php endforeach; ?>
