<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->addresses()->orderByDesc('is_default')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:30',
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'is_default' => 'boolean',
        ]);
        $data['user_id'] = $request->user()->id;
        if (!empty($data['is_default'])) {
            $request->user()->addresses()->update(['is_default' => false]);
        }
        $address = Address::create($data);
        return response()->json($address, 201);
    }

    public function show(Request $request, Address $address)
    {
        $this->authorizeAddress($request, $address);
        return response()->json($address);
    }

    public function update(Request $request, Address $address)
    {
        $this->authorizeAddress($request, $address);
        $data = $request->validate([
            'full_name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:30',
            'address_line1' => 'sometimes|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'sometimes|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'is_default' => 'boolean',
        ]);
        if (!empty($data['is_default'])) {
            $request->user()->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
        }
        $address->update($data);
        return response()->json($address);
    }

    public function destroy(Request $request, Address $address)
    {
        $this->authorizeAddress($request, $address);
        $address->delete();
        return response()->json(['message' => 'Deleted']);
    }

    protected function authorizeAddress(Request $request, Address $address): void
    {
        if ($address->user_id !== $request->user()->id) {
            abort(403, 'Forbidden');
        }
    }
}
