var client;
var stickerpack = new Array();
var homeserver;
function login()
{
	homeserver = document.getElementById("homeserver").value;
	var token = document.getElementById("token").value;
	client = matrixcs.createClient({
		baseUrl: homeserver,
		accessToken: token
	});
}

function multiUpload()
{
	var files = document.getElementById("upload").files;
	var avatar = document.getElementById("avatar").files[0];
	

	for (var i = 0; i < files.length; i++) {
		upload(files[i], i);
	}

	client.uploadContent(avatar).then(mxc => {
		generateStickerpackForm(mxc);
	});
}

function generateStickerpackForm(mxc)
{
	var stickerpack = document.getElementById("stickerpack");

	var img = document.createElement("img");
	img.src=client.mxcUrlToHttp(mxc);

	img.style = "width: 18rem;";
	img.id="avatarurl";
	img.className=mxc;
	stickerpack.prepend(img);
}

function generateForm(mxc, mxcthumb, mimetype, width, height)
{
	var preview = document.getElementById("preview");	

	var div = document.createElement("div");
	div.className = "card";
	div.style = "width: 18rem; display: inline-block;";
	div.id = mxc;
	
	var img = document.createElement("img");
	img.className="card-img-top";
	img.src=client.mxcUrlToHttp(mxc);
	img.mxc = mxc
	div.appendChild(img);
	
	var heightStore = document.createElement("input");
	heightStore.type = "hidden";
	heightStore.value = height;
	heightStore.id = "height" + mxc;
	div.appendChild(heightStore);

	var widthStore = document.createElement("input");
	widthStore.type = "hidden";
	widthStore.value = width;
	widthStore.id = "width" + mxc;
	div.appendChild(widthStore);

	var body = document.createElement("div");
	body.className = "card-body"
	div.appendChild(body);

	var name = document.createElement("input");
	name.type = "text";
	name.id = "name" + mxc;
	name.placeholder="Name"
	body.appendChild(name);

	var desc = document.createElement("input");
	desc.type = "text";
	desc.id = "desc" + mxc;
	desc.placeholder="Description"
	body.appendChild(desc);

	var thumb = document.createElement("input");
	thumb.type = "hidden";
	thumb.id = "thumb" + mxc;
	thumb.value = mxcthumb;
	body.appendChild(thumb);
	
	var mime = document.createElement("input");
	mime.type = "hidden";
	mime.id = "mime" + mxc;
	mime.value = mimetype;
	body.appendChild(mime);

	preview.appendChild(div);
}

function upload(file)
{

	var mimetype = file.type;

	client.uploadContent(file).then(mxc => {

		var img = new Image();
		img.src = client.mxcUrlToHttp(mxc);

		img.onload = function() {

			var maxWidth = 512; // Max width for the image
			var maxHeight = 512;    // Max height for the image

			var width = img.width;
			var height = img.height;
			var ratio = 0;  // Used for aspect ratio

			// Check if the current width is larger than the max
			if(width > maxWidth){
				ratio = maxWidth / width;
				width = maxWidth; // Set new width
				height = Math.floor(height * ratio);
			}
			if(height > maxWidth) {
				ratio = maxHeight / height;
				height = maxWidth;
				width = Math.floor(width * ratio);
			}
			if(width > maxWidth){
				ratio = maxWidth / width;
				width = maxWidth;
				height = Math.floor(height * ratio);
			}

			var http = new XMLHttpRequest();
			http.open("GET", client.mxcUrlToHttp(mxc, width, height, "scale"));
			http.responseType = "blob";
			http.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					client.uploadContent(this.response, {type: this.response.type}).then(mxcthumb => {
						generateForm(mxc, mxcthumb, mimetype, width, height);
					});
				}
			};
			http.send();
		}
	});
	
}

function generateMigration()
{
	var preview = document.getElementById("preview");
	
	var type = "stickerpack";
	var stickername = document.getElementById("name").value;
	var avatarUrl = document.getElementById("avatarurl").className;
	var description = document.getElementById("description").value;
	var isEnabled = "true";
	var isPublic = "true";
	var authorType = document.getElementById("authorType").value;
	var authorReference = document.getElementById("authorReference").value;
		if (authorReference == "") authorReference = null;
	var authorName = document.getElementById("authorName").value;
		if (authorName == "") authorName = null;
	var license = document.getElementById("license").value;
	var licensePath = document.getElementById("licensePath").value;
		if (licensePath == "") licensePath = null;

	var txt = "";
document.getElementById("result").value = txt;
	txt += 'import { QueryInterface } from "sequelize";\n'
document.getElementById("result").value = txt;
	txt += 	'export default {\n'
	+	'	up: (queryInterface: QueryInterface) => {\n'
	+	'		return Promise.resolve()\n'
	+	'			.then(() => queryInterface.bulkInsert("dimension_sticker_packs", [\n';
document.getElementById("result").value = txt;
	txt +=	'				{\n'
document.getElementById("result").value = txt;
	txt +=	'					type: "' + type +'",\n'
	+	'					name: "' + stickername + '",\n'
	+	'					avatarUrl: "' + avatarUrl + '",\n'
	+	'					isEnabled: ' + isEnabled + ',\n'
	+	'					isPublic: ' + isPublic + ',\n'
	+	'					description: "' + description + '",\n'
	+	'					authorType: "' + authorType + '",\n';
document.getElementById("result").value = txt;
	if (authorReference === null)
	txt +=	'					authorReference: ' + "null" + ',\n';
	else
	txt +=	'					authorReference: "' + authorReference + '",\n';
document.getElementById("result").value = txt;
	if (authorName === null)
	txt +=	'					authorName: ' + "null" + ',\n';
	else
	txt +=	'					authorName: "' + authorName + '",\n';
document.getElementById("result").value = txt;
	txt +=	'					license: "' + license +'",\n';
document.getElementById("result").value = txt;
	if (licensePath === null)
	txt +=	'					licensePath: ' + "null" + ',\n';
	else
	txt +=	'					licensePath: "' + licensePath + '",\n';
document.getElementById("result").value = txt;
	txt +=	'				}\n'
	+	'			]))\n';

	txt +=	'			.then(packId => {\n'
	+	'				return queryInterface.bulkInsert("dimension_stickers", [\n';
document.getElementById("result").value = txt;
	for (let div of preview.childNodes) {
		
		var mxcImg = div.id;
		var mxcThmb = document.getElementById("thumb" + mxcImg).value;
		var thmbWidth =  document.getElementById("width" + mxcImg).value;
		var thmbHeight =  document.getElementById("height" + mxcImg).value;
		var name = document.getElementById("name" + mxcImg).value;
		var desc = document.getElementById("desc" + mxcImg).value;
		var type = document.getElementById("mime" + mxcImg).value;
document.getElementById("result").value = txt;
		txt += '					{ packId: packId, name: "' + name + '", description: "' + desc + '", ' + 'imageMxc: "' + mxcImg + '", thumbnailMxc: "' + mxcThmb + '", mimetype: "' + type + '", ' + 'thumbnailWidth: ' + thmbWidth + ', thumbnailHeight: ' + thmbHeight + ' },\n'
	}
document.getElementById("result").value = txt;
	txt +=	'				])\n'
	+	'			});\n'
	+	'		},\n'
	+	'	down: (_queryInterface: QueryInterface) => {\n'
	+	'		throw new Error("there is no going back");\n
	+	'	}\n'
	+	'}'

	document.getElementById("result").value = txt;
}
